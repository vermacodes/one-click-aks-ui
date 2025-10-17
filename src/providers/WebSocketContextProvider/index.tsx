import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import ReconnectingWebSocket, { ErrorEvent } from "reconnecting-websocket";
import { WebSocketContext } from "../../context/WebSocketContext";
import {
  ActionStatusType,
  LogsStreamType,
  ServerNotification,
  TerraformOperation,
} from "../../dataStructures";
import {
  getDefaultServerNotification,
  getDefaultTerraformOperation,
} from "../../defaults";
import { useServerStatus } from "../../hooks/useServerStatus";
import {
  getAuthToken,
  myInteractionInProgressHandler,
} from "../../utils/axios-interceptors";

// WebSocket configuration
const WS_CONFIG = {
  connectionTimeout: 4000,
  maxRetries: 5,
  maxReconnectionDelay: 10000,
  minReconnectionDelay: 1000,
  reconnectionDelayGrowFactor: 2,
  minUptime: 5000,
  debug: false,
};

const CONNECTION_TIMEOUT = 30000; // 30 seconds

export default function WebSocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  // Session ID to track current connection generation
  const sessionId = useRef(Date.now());

  // Connection states
  const [actionStatusConnected, setActionStatusConnected] = useState(false);
  const [logStreamConnected, setLogStreamConnected] = useState(false);
  const [terraformOperationConnected, setTerraformOperationConnected] =
    useState(false);
  const [serverNotificationConnected, setServerNotificationConnected] =
    useState(false);

  // Data states
  const [actionStatus, setActionStatus] = useState<ActionStatusType>({
    inProgress: false,
  });
  const [logStream, setLogStream] = useState<LogsStreamType>({ logs: "" });
  const [terraformOperation, setTerraformOperation] =
    useState<TerraformOperation>(getDefaultTerraformOperation());
  const [serverNotification, setServerNotification] =
    useState<ServerNotification>(getDefaultServerNotification());

  // Server status monitoring
  const {
    data: serverStatus,
    isError,
    isLoading,
    isFetching,
  } = useServerStatus();
  const lastServerStatusRef = useRef<string | undefined>(undefined);
  const websocketRefs = useRef<{
    actionStatusWs?: ReconnectingWebSocket;
    logStreamWs?: ReconnectingWebSocket;
    terraformOperationWs?: ReconnectingWebSocket;
    serverNotificationWs?: ReconnectingWebSocket;
  }>({});

  // Connection state management (simplified)
  const createDefaultConnectionState = () => ({
    connectionAttempts: 0,
    lastConnectionAttempt: 0,
    maxRetriesReached: false,
    nextRetryAt: 0,
    shouldAttemptConnection: true,
    serverWasOffline: false,
  });

  const CONNECTION_TYPES = [
    "actionStatus",
    "logStream",
    "terraformOperation",
    "serverNotification",
  ] as const;

  const [connectionStates, setConnectionStates] = useState(() => {
    const initialStates = new Map();
    const defaultState = createDefaultConnectionState();
    CONNECTION_TYPES.forEach((type) => {
      initialStates.set(type, { ...defaultState });
    });
    return initialStates;
  });

  // Refetch data on actionstatus changes
  const invalidateQueriesOnActionStatusChange = (connectionName: string) => {
    if (connectionName === "Action Status") {
      // Add 1 second delay before refetching
      setTimeout(() => {
        queryClient.refetchQueries("list-deployments");
        queryClient.refetchQueries("list-terraform-workspaces");
        queryClient.refetchQueries("get-selected-terraform-workspace");
        queryClient.refetchQueries("get-resources");
      }, 1000);
    }
  };

  // Reset all connection states
  const resetAllConnectionStates = () => {
    setConnectionStates(() => {
      const newStates = new Map();
      CONNECTION_TYPES.forEach((type) => {
        newStates.set(type, createDefaultConnectionState());
      });
      return newStates;
    });
  };

  // WebSocket creation
  const createAuthenticatedWebSocket = (
    baseUrl: string,
    endpoint: string,
  ): ReconnectingWebSocket => {
    const ws = new ReconnectingWebSocket(
      `${baseUrl}${endpoint}`,
      [],
      WS_CONFIG,
    );

    ws.addEventListener("open", () => {
      getAuthToken()
        .then((token) =>
          ws.send(JSON.stringify({ type: "auth", data: { token } })),
        )
        .catch((error) => {
          myInteractionInProgressHandler();
        });
    });

    return ws;
  };

  // WebSocket handlers
  const createWebSocketHandlers = (
    connectionName: string,
    setConnected: (connected: boolean) => void,
    setData: (data: any) => void,
    currentSessionId: number,
  ) => {
    return {
      onopen: () => {
        // Only update state if this is from current session
        if (sessionId.current === currentSessionId) {
          setConnected(true);
        }
      },
      onclose: () => {
        // Only update state if this is from current session
        if (sessionId.current === currentSessionId) {
          setConnected(false);
        }
      },
      onmessage: (event: MessageEvent) => {
        // Refetch relevant queries on action status updates
        invalidateQueriesOnActionStatusChange(connectionName);

        // Only update state if this is from current session
        if (sessionId.current === currentSessionId) {
          setConnected(true);
          try {
            const data = JSON.parse(event.data);
            setData(data);
          } catch (error) {}
        }
      },
      onerror: (event: ErrorEvent) => {
        // Only update state if this is from current session
        if (sessionId.current === currentSessionId) {
          setConnected(false);
        }
      },
    };
  };

  // WebSocket initialization
  const initializeWebSockets = () => {
    try {
      const serverHosting = JSON.parse(
        localStorage.getItem("serverHosting") || "{}",
      );
      let baseUrl = serverHosting.endpoint?.replace("http", "ws");
      if (baseUrl && !baseUrl.endsWith("/")) baseUrl += "/";

      if (!baseUrl) {
        return;
      }

      // Create new session ID to invalidate old connections
      sessionId.current = Date.now();
      const currentSessionId = sessionId.current;

      resetAllConnectionStates();

      // Connection timeout - mark failed connections as exhausted
      const connectionTimeout = setTimeout(() => {
        setConnectionStates((prev) => {
          const newStates = new Map(prev);
          const connections = [
            { type: "actionStatus", connected: actionStatusConnected },
            { type: "logStream", connected: logStreamConnected },
            {
              type: "terraformOperation",
              connected: terraformOperationConnected,
            },
            {
              type: "serverNotification",
              connected: serverNotificationConnected,
            },
          ];

          connections.forEach(({ type, connected }) => {
            if (!connected) {
              const currentState =
                newStates.get(type) || createDefaultConnectionState();
              newStates.set(type, {
                ...currentState,
                maxRetriesReached: true,
                shouldAttemptConnection: false,
              });
            }
          });

          return newStates;
        });
      }, CONNECTION_TIMEOUT);

      setTimeout(
        () => clearTimeout(connectionTimeout),
        CONNECTION_TIMEOUT + 5000,
      );

      // Close existing connections
      Object.values(websocketRefs.current).forEach((ws) => ws?.close());

      // Create new connections
      const connections = [
        {
          ref: "actionStatusWs" as const,
          endpoint: "actionstatusws",
          name: "Action Status",
          setState: setActionStatusConnected,
          setData: setActionStatus,
        },
        {
          ref: "logStreamWs" as const,
          endpoint: "logsws",
          name: "Log Stream",
          setState: setLogStreamConnected,
          setData: setLogStream,
        },
        {
          ref: "terraformOperationWs" as const,
          endpoint: "terraform/statusws",
          name: "Terraform Operation",
          setState: setTerraformOperationConnected,
          setData: setTerraformOperation,
        },
        {
          ref: "serverNotificationWs" as const,
          endpoint: "serverNotificationWs",
          name: "Server Notification",
          setState: setServerNotificationConnected,
          setData: setServerNotification,
        },
      ];

      connections.forEach(({ ref, endpoint, name, setState, setData }) => {
        const ws = createAuthenticatedWebSocket(baseUrl, endpoint);
        const handlers = createWebSocketHandlers(
          name,
          setState,
          setData,
          currentSessionId,
        );

        ws.addEventListener("open", handlers.onopen);
        ws.addEventListener("close", handlers.onclose);
        ws.addEventListener("message", handlers.onmessage);
        ws.addEventListener("error", handlers.onerror);

        websocketRefs.current[ref] = ws;
      });
    } catch (error) {}
  };

  // Initial WebSocket setup
  useEffect(() => {
    initializeWebSockets();
    return () => {
      Object.values(websocketRefs.current).forEach((ws) => ws?.close());
    };
  }, []);

  // Server status monitoring
  useEffect(() => {
    const currentServerStatus = serverStatus?.status;
    const lastServerStatus = lastServerStatusRef.current;

    if (lastServerStatus !== "OK" && currentServerStatus === "OK") {
      resetAllConnectionStates();
      setTimeout(() => {
        initializeWebSockets();
      }, 1000);
    }

    lastServerStatusRef.current = currentServerStatus;
  }, [serverStatus?.status, isError, isLoading]);

  const manualRetry = () => {
    resetAllConnectionStates();
    initializeWebSockets();
  };

  return (
    <WebSocketContext.Provider
      value={{
        // Data
        actionStatus,
        setActionStatus,
        logStream,
        setLogStream,
        terraformOperation,
        setTerraformOperation,
        serverNotification,
        setServerNotification,

        // Connection states
        actionStatusConnected,
        setActionStatusConnected,
        logStreamConnected,
        setLogStreamConnected,
        terraformOperationConnected,
        setTerraformOperationConnected,
        serverNotificationConnected,
        setServerNotificationConnected,

        // Connection management
        connectionStates,
        serverIsOnline: !isError && serverStatus?.status === "OK",
        canAttemptReconnection: true,
        manualRetry,
        pauseAllConnections: () => {},
        resumeAllConnections: () => {},
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

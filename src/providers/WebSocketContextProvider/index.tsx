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
  reconnectionDelayGrowFactor: 1.3,
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

  // Connection state management
  const createDefaultConnectionState = () => ({
    connectionAttempts: 0,
    lastConnectionAttempt: 0,
    maxRetriesReached: false,
    nextRetryAt: 0,
    shouldAttemptConnection: true,
    serverWasOffline: false,
  });

  const [connectionStates, setConnectionStates] = useState(() => {
    const initialStates = new Map();
    const defaultState = createDefaultConnectionState();
    [
      "actionStatus",
      "logStream",
      "terraformOperation",
      "serverNotification",
    ].forEach((type) => {
      initialStates.set(type, { ...defaultState });
    });
    return initialStates;
  });

  // Connection state helpers
  const markRetriesExhausted = (connectionType: string) => {
    setConnectionStates((prev) => {
      const newStates = new Map(prev);
      const currentState =
        newStates.get(connectionType) || createDefaultConnectionState();
      newStates.set(connectionType, {
        ...currentState,
        maxRetriesReached: true,
        shouldAttemptConnection: false,
      });
      return newStates;
    });
  };

  const resetConnectionState = (connectionType: string) => {
    setConnectionStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(connectionType, createDefaultConnectionState());
      return newStates;
    });
  };

  const resetAllConnectionStates = () => {
    setConnectionStates(() => {
      const newStates = new Map();
      [
        "actionStatus",
        "logStream",
        "terraformOperation",
        "serverNotification",
      ].forEach((type) => {
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
          console.error("Failed to send auth token for WebSocket:", error);
        });
    });

    return ws;
  };

  // WebSocket handlers
  const createWebSocketHandlers = (
    connectionName: string,
    setConnected: (connected: boolean) => void,
    setData: (data: any) => void,
  ) => {
    return {
      onopen: () => {
        console.log(`${connectionName} WebSocket connected`);
        setConnected(true);
      },
      onclose: () => {
        console.log(`${connectionName} WebSocket disconnected`);
        setConnected(false);
      },
      onmessage: (event: MessageEvent) => {
        setConnected(true);
        try {
          const data = JSON.parse(event.data);
          setData(data);
        } catch (error) {
          console.error(`Failed to parse ${connectionName} message:`, error);
        }
      },
      onerror: (event: ErrorEvent) => {
        console.error(
          `${connectionName} WebSocket error:`,
          event.error || event.message,
        );
        setConnected(false);
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
        console.warn("No server hosting endpoint found");
        return;
      }

      resetAllConnectionStates();

      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (!actionStatusConnected) markRetriesExhausted("actionStatus");
        if (!logStreamConnected) markRetriesExhausted("logStream");
        if (!terraformOperationConnected)
          markRetriesExhausted("terraformOperation");
        if (!serverNotificationConnected)
          markRetriesExhausted("serverNotification");
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
          ref: "actionStatusWs",
          endpoint: "actionstatusws",
          handlers: createWebSocketHandlers(
            "Action Status",
            setActionStatusConnected,
            setActionStatus,
          ),
        },
        {
          ref: "logStreamWs",
          endpoint: "logsws",
          handlers: createWebSocketHandlers(
            "Log Stream",
            setLogStreamConnected,
            setLogStream,
          ),
        },
        {
          ref: "terraformOperationWs",
          endpoint: "terraform/statusws",
          handlers: createWebSocketHandlers(
            "Terraform Operation",
            setTerraformOperationConnected,
            setTerraformOperation,
          ),
        },
        {
          ref: "serverNotificationWs",
          endpoint: "serverNotificationWs",
          handlers: createWebSocketHandlers(
            "Server Notification",
            setServerNotificationConnected,
            setServerNotification,
          ),
        },
      ];

      connections.forEach(({ ref, endpoint, handlers }) => {
        const ws = createAuthenticatedWebSocket(baseUrl, endpoint);

        ws.addEventListener("open", handlers.onopen);
        ws.addEventListener("close", handlers.onclose);
        ws.addEventListener("message", handlers.onmessage);
        ws.addEventListener("error", handlers.onerror);

        websocketRefs.current[ref as keyof typeof websocketRefs.current] = ws;
      });
    } catch (error) {
      console.error("Failed to initialize authenticated WebSockets:", error);
    }
  };

  // Initial WebSocket setup
  useEffect(() => {
    initializeWebSockets();
    return () => {
      Object.values(websocketRefs.current).forEach((ws) => ws?.close());
    };
  }, [queryClient]);

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

        // Smart WebSocket Manager values
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

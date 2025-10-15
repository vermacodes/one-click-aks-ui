import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import ReconnectingWebSocket from "reconnecting-websocket";
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
import {
  getAuthToken,
  myInteractionInProgressHandler,
} from "../../utils/axios-interceptors";

export default function WebSocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // action status
  const [actionStatus, setActionStatus] = useState<ActionStatusType>({
    inProgress: false,
  });
  const [actionStatusConnected, setActionStatusConnected] = useState(false);

  // log stream
  const [logStream, setLogStream] = useState<LogsStreamType>({
    logs: "",
  });
  const [logStreamConnected, setLogStreamConnected] = useState(false);

  // terraform operation
  const [terraformOperation, setTerraformOperation] =
    useState<TerraformOperation>(getDefaultTerraformOperation());
  const [terraformOperationConnected, setTerraformOperationConnected] =
    useState(false);

  // server notification
  const [serverNotification, setServerNotification] =
    useState<ServerNotification>(getDefaultServerNotification());
  const [serverNotificationConnected, setServerNotificationConnected] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  // Helper function to create authenticated WebSocket using message-based auth
  const createAuthenticatedWebSocket = (
    baseUrl: string,
    endpoint: string,
  ): ReconnectingWebSocket => {
    const options = {
      connectionTimeout: 4000,
      maxRetries: 5,
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      minUptime: 5000,
      debug: false,
    };

    const ws = new ReconnectingWebSocket(`${baseUrl}${endpoint}`, [], options);

    ws.addEventListener("open", () => {
      getAuthToken()
        .then((token) => {
          ws.send(JSON.stringify({ type: "auth", data: { token: token } }));
        })
        .catch((error) => {
          myInteractionInProgressHandler();
          console.error("Failed to send auth token for WebSocket:", error);
        });
    });

    return ws;
  };

  useEffect(() => {
    let isMounted = true;
    let actionStatusWs: ReconnectingWebSocket;
    let logStreamWs: ReconnectingWebSocket;
    let terraformOperationWs: ReconnectingWebSocket;
    let serverNotificationWs: ReconnectingWebSocket;

    const initializeWebSockets = () => {
      try {
        // Get base URL from localStorage
        let serverHosting = JSON.parse(
          localStorage.getItem("serverHosting") || "{}",
        );
        let baseUrl = serverHosting.endpoint?.replace("http", "ws");
        if (baseUrl && !baseUrl.endsWith("/")) {
          baseUrl += "/";
        }

        if (!baseUrl) {
          console.warn("No server hosting endpoint found");
          return;
        }

        if (!isMounted) return;

        // Create authenticated WebSockets using message-based authentication
        actionStatusWs = createAuthenticatedWebSocket(
          baseUrl,
          "actionstatusws",
        );
        logStreamWs = createAuthenticatedWebSocket(baseUrl, "logsws");
        terraformOperationWs = createAuthenticatedWebSocket(
          baseUrl,
          "terraform/statusws",
        );
        serverNotificationWs = createAuthenticatedWebSocket(
          baseUrl,
          "serverNotificationWs",
        );

        // Action Status WebSocket
        actionStatusWs.onopen = () => {
          setActionStatusConnected(true);
        };
        actionStatusWs.onclose = () => {
          setActionStatusConnected(false);
        };
        actionStatusWs.onmessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          // Ignore auth response messages
          if (data.type === "auth-response") {
            if (!data.success) {
              console.error(
                "WebSocket authentication failed for actionstatusws",
              );
            }
            return;
          }
          setActionStatus(data);
          queryClient.invalidateQueries("list-deployments");
          queryClient.invalidateQueries("list-terraform-workspaces");
          queryClient.invalidateQueries("get-selected-terraform-workspace");
          queryClient.invalidateQueries("get-resources");
        };
        actionStatusWs.onerror = (error) => {
          console.error("Action Status WebSocket error:", error);
        };

        // Log Stream WebSocket
        logStreamWs.onopen = () => {
          setLogStreamConnected(true);
        };
        logStreamWs.onclose = () => {
          setLogStreamConnected(false);
        };
        logStreamWs.onmessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === "auth-response") {
            if (!data.success) {
              console.error("WebSocket authentication failed for logsws");
            }
            return;
          }
          setLogStream(data);
        };
        logStreamWs.onerror = (error) => {
          console.error("Log Stream WebSocket error:", error);
        };

        // Terraform Operation WebSocket
        terraformOperationWs.onopen = () => {
          setTerraformOperationConnected(true);
        };
        terraformOperationWs.onclose = () => {
          setTerraformOperationConnected(false);
        };
        terraformOperationWs.onmessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === "auth-response") {
            if (!data.success) {
              console.error(
                "WebSocket authentication failed for terraform/statusws",
              );
            }
            return;
          }
          setTerraformOperation(data);
        };
        terraformOperationWs.onerror = (error) => {
          console.error("Terraform Operation WebSocket error:", error);
        };

        // Server Notification WebSocket
        serverNotificationWs.onopen = () => {
          setServerNotificationConnected(true);
        };
        serverNotificationWs.onclose = () => {
          setServerNotificationConnected(false);
        };
        serverNotificationWs.onmessage = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === "auth-response") {
            if (!data.success) {
              console.error(
                "WebSocket authentication failed for serverNotificationWs",
              );
            }
            return;
          }
          setServerNotification(data);
        };
        serverNotificationWs.onerror = (error) => {
          console.error("Server Notification WebSocket error:", error);
        };
      } catch (error) {
        console.error("Failed to initialize authenticated WebSockets:", error);
      }
    };

    initializeWebSockets();

    return () => {
      isMounted = false;
      if (actionStatusWs) actionStatusWs.close();
      if (logStreamWs) logStreamWs.close();
      if (terraformOperationWs) terraformOperationWs.close();
      if (serverNotificationWs) serverNotificationWs.close();
    };
  }, [queryClient]);

  return (
    <WebSocketContext.Provider
      value={{
        actionStatus,
        setActionStatus,
        logStream,
        setLogStream,
        terraformOperation,
        setTerraformOperation,
        actionStatusConnected,
        setActionStatusConnected,
        logStreamConnected,
        setLogStreamConnected,
        terraformOperationConnected,
        setTerraformOperationConnected,
        serverNotification,
        setServerNotification,
        serverNotificationConnected,
        setServerNotificationConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

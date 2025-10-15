import { useContext, useEffect, useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { WebSocketContext } from "../../../context/WebSocketContext";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

// Configuration for WebSocket connection timeouts
const WEBSOCKET_CONFIG = {
  WARNING_DELAY: 30_000, // Show warning after 30 seconds
  RECONNECT_DELAY: 60_000, // Try reconnection after 60 seconds
  MAX_RECONNECT_ATTEMPTS: 3,
} as const;

export default function WebSocketConnectionStatus() {
  const { data: serverStatus, isError } = useServerStatus();
  const { actionStatusConnected, logStreamConnected } =
    useContext(WebSocketContext);

  const [showWarning, setShowWarning] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const bothConnected = actionStatusConnected && logStreamConnected;
  const hasPartialConnection = actionStatusConnected || logStreamConnected;

  useEffect(() => {
    // Reset warning and attempts if both connections are successful
    if (bothConnected) {
      setShowWarning(false);
      setReconnectAttempts(0);
      return;
    }

    // Set timeout to show warning after configured delay
    const warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, WEBSOCKET_CONFIG.WARNING_DELAY);

    // Set timeout for reconnection attempt
    const reconnectTimer = setTimeout(() => {
      if (reconnectAttempts < WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
        setReconnectAttempts((prev) => prev + 1);
        // Trigger a page reload to attempt reconnection
        // This is a simple reconnection strategy
        window.location.reload();
      }
    }, WEBSOCKET_CONFIG.RECONNECT_DELAY);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(reconnectTimer);
    };
  }, [bothConnected, reconnectAttempts]);

  // Don't show anything if server is not running
  if (isError || serverStatus?.status !== "OK") {
    return null;
  }

  // Don't show warning if not ready to show or if fully connected
  if (!showWarning || bothConnected) {
    return null;
  }

  // Determine alert variant and message based on connection status
  const getAlertContent = () => {
    if (!actionStatusConnected && !logStreamConnected) {
      return {
        variant: "warning" as const,
        title: "WebSocket Connection Failed",
        message:
          "Unable to establish real-time connections. Some features may not work properly.",
      };
    }

    if (hasPartialConnection) {
      return {
        variant: "info" as const,
        title: "Partial WebSocket Connection",
        message:
          "Some real-time features may be limited due to partial connection.",
      };
    }

    return {
      variant: "info" as const,
      title: "Connecting WebSockets",
      message: "Establishing real-time connections. Please wait...",
    };
  };

  const { variant, title, message } = getAlertContent();

  return (
    <Alert variant={variant}>
      <div className="flex items-center gap-2">
        <TbFidgetSpinner className="animate-spin" />
        <div className="flex flex-col">
          <strong>{title}:</strong>
          <span className="text-sm">{message}</span>
          {reconnectAttempts > 0 && (
            <span className="text-xs opacity-75">
              Reconnection attempts: {reconnectAttempts}/
              {WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS}
            </span>
          )}
        </div>
      </div>
    </Alert>
  );
}

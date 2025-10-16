import { useContext } from "react";
import { TbFidgetSpinner, TbRefresh } from "react-icons/tb";
import { WebSocketContext } from "../../../context/WebSocketContext";
import Alert from "../../UserInterfaceComponents/Alert";

export default function WebSocketConnectionStatus() {
  const {
    actionStatusConnected,
    logStreamConnected,
    terraformOperationConnected,
    serverNotificationConnected,
    serverIsOnline,
    canAttemptReconnection,
    connectionStates,
    manualRetry,
  } = useContext(WebSocketContext);

  // Check connection status
  const allConnected =
    actionStatusConnected &&
    logStreamConnected &&
    terraformOperationConnected &&
    serverNotificationConnected;

  const hasPartialConnection =
    actionStatusConnected ||
    logStreamConnected ||
    terraformOperationConnected ||
    serverNotificationConnected;

  // Don't show anything if server is offline
  if (!serverIsOnline) {
    return (
      <Alert variant="info">
        <div className="flex items-center gap-2">
          <TbFidgetSpinner className="animate-spin" />
          <div className="flex flex-col">
            <strong>Server Offline:</strong>
            <span className="text-sm">
              Waiting for server to come online. WebSocket connections will
              resume automatically.
            </span>
          </div>
        </div>
      </Alert>
    );
  }

  // Don't show anything if all connections are working
  if (allConnected) {
    return null;
  }

  // Determine if retries are exhausted for any connection
  const anyRetriesExhausted = Array.from(connectionStates.values()).some(
    (state) => state.maxRetriesReached,
  );

  // Get alert content based on connection status
  const getAlertContent = () => {
    if (!hasPartialConnection) {
      if (anyRetriesExhausted && canAttemptReconnection) {
        return {
          variant: "warning" as const,
          title: "WebSocket Connection Failed",
          message:
            "Real-time features are unavailable. Manual retry available.",
          showRetry: true,
        };
      }
      return {
        variant: "warning" as const,
        title: "WebSocket Connection Failed",
        message: "Attempting to restore real-time features...",
        showRetry: false,
      };
    }

    if (hasPartialConnection) {
      return {
        variant: "info" as const,
        title: "Partial WebSocket Connection",
        message:
          "Some real-time features may be limited. Attempting to restore full connectivity.",
        showRetry: anyRetriesExhausted,
      };
    }

    return {
      variant: "info" as const,
      title: "Connecting WebSockets",
      message: "Establishing real-time connections. Please wait...",
      showRetry: false,
    };
  };

  const { variant, title, message, showRetry } = getAlertContent();

  const handleManualRetry = () => {
    manualRetry();
  };

  return (
    <Alert variant={variant}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbFidgetSpinner className="animate-spin" />
          <div className="flex flex-col">
            <strong>{title}:</strong>
            <span className="text-sm">{message}</span>
            <div className="mt-1 text-xs opacity-75">
              Status: {actionStatusConnected ? "✓" : "✗"} Actions,{" "}
              {logStreamConnected ? "✓" : "✗"} Logs,{" "}
              {terraformOperationConnected ? "✓" : "✗"} Terraform,{" "}
              {serverNotificationConnected ? "✓" : "✗"} Notifications
            </div>
          </div>
        </div>
        {showRetry && (
          <button
            onClick={handleManualRetry}
            className="ml-4 flex items-center gap-1 rounded border border-current bg-white/20 px-3 py-1 text-sm transition-colors hover:bg-white/30"
            title="Retry WebSocket connections"
          >
            <TbRefresh className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </Alert>
  );
}

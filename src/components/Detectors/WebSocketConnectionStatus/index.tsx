import { useContext, useEffect, useRef, useState } from "react";
import { TbFidgetSpinner, TbRefresh } from "react-icons/tb";
import { WebSocketContext } from "../../../context/WebSocketContext";
import Alert from "../../UserInterfaceComponents/Alert";

const INITIAL_DELAY_MS = 3000; // 3 seconds before showing alert
const DEBOUNCE_CLEAR_MS = 12000; // 12 seconds of stable connection before clearing

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

  const [shouldShowAlert, setShouldShowAlert] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check connection status
  const allConnected =
    actionStatusConnected &&
    logStreamConnected &&
    terraformOperationConnected &&
    serverNotificationConnected;

  const hasConnectionIssues = !allConnected && serverIsOnline;

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();

    // Clear any existing timeouts
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }

    if (hasConnectionIssues) {
      // Connection issues detected - show alert after initial delay (if not already shown)
      if (!shouldShowAlert) {
        showTimeoutRef.current = setTimeout(() => {
          setShouldShowAlert(true);
        }, INITIAL_DELAY_MS);
      }
    } else if (allConnected && shouldShowAlert) {
      // All connections restored - debounce clearing the alert

      clearTimeoutRef.current = setTimeout(() => {
        setShouldShowAlert(false);
      }, DEBOUNCE_CLEAR_MS);
    }

    // Cleanup function
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
    };
  }, [hasConnectionIssues, allConnected, serverIsOnline, shouldShowAlert]);

  // Don't show anything if server is offline or alert shouldn't be shown
  if (!serverIsOnline || !shouldShowAlert) {
    return null;
  }

  const hasPartialConnection =
    actionStatusConnected ||
    logStreamConnected ||
    terraformOperationConnected ||
    serverNotificationConnected;

  const anyRetriesExhausted = Array.from(connectionStates.values()).some(
    (state) => state.maxRetriesReached,
  );

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

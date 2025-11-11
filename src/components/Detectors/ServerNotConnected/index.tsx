import { useEffect, useState } from "react";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

// Global state to persist warning across page changes
let hasShownInitialWarning = false;
let serverConnectionFailed = false;

export default function ServerNotConnected() {
  const { data: serverStatus, isLoading } = useServerStatus();
  const [showWarning, setShowWarning] = useState(serverConnectionFailed);

  useEffect(() => {
    // If server is OK, hide warning immediately and reset flags
    if (serverStatus?.status === "OK") {
      setShowWarning(false);
      serverConnectionFailed = false;
      hasShownInitialWarning = true;
      return;
    }

    // Don't show warning while initial loading (but show it if we've already detected a failure)
    if (isLoading && !hasShownInitialWarning) {
      return;
    }

    // If we already know the server has failed, show warning immediately
    if (serverConnectionFailed) {
      setShowWarning(true);
      return;
    }

    // First time detecting failure - add delay only for initial detection
    if (!hasShownInitialWarning) {
      const timer = setTimeout(() => {
        setShowWarning(true);
        serverConnectionFailed = true;
        hasShownInitialWarning = true;
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // We've already shown warning before, show immediately
      setShowWarning(true);
      serverConnectionFailed = true;
    }
  }, [serverStatus?.status, isLoading]);

  // Show warning only if showWarning state is true
  if (showWarning) {
    return (
      <Alert variant="warning">
        <strong>⚠️ ACT Labs Server Not Connected:</strong> Unable to connect to
        the ACT Labs Server.
      </Alert>
    );
  }

  // If server is connected or still loading, don't show anything
  return null;
}

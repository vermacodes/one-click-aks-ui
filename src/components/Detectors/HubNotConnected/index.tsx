import { useEffect, useState } from "react";
import { useHubStatus } from "../../../hooks/useHubStatus";
import Alert from "../../UserInterfaceComponents/Alert";

// Global state to persist warning across page changes
let hasShownInitialWarning = false;
let hubConnectionFailed = false;

export default function HubNotConnected() {
  const { data: hubStatus, isLoading } = useHubStatus();
  const [showWarning, setShowWarning] = useState(hubConnectionFailed);

  useEffect(() => {
    // If hub is OK, hide warning immediately and reset flags
    if (hubStatus?.status === "OK") {
      setShowWarning(false);
      hubConnectionFailed = false;
      hasShownInitialWarning = true;
      return;
    }

    // Don't show warning while initial loading (but show it if we've already detected a failure)
    if (isLoading && !hasShownInitialWarning) {
      return;
    }

    // If we already know the hub has failed, show warning immediately
    if (hubConnectionFailed) {
      setShowWarning(true);
      return;
    }

    // First time detecting failure - add delay only for initial detection
    if (!hasShownInitialWarning) {
      const timer = setTimeout(() => {
        setShowWarning(true);
        hubConnectionFailed = true;
        hasShownInitialWarning = true;
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // We've already shown warning before, show immediately
      setShowWarning(true);
      hubConnectionFailed = true;
    }
  }, [hubStatus?.status, isLoading]);

  // Show warning only if showWarning state is true
  if (showWarning) {
    return (
      <Alert variant="warning">
        <strong>⚠️ ACT Labs Hub Not Connected:</strong> Unable to connect to the
        ACT Labs Hub.
      </Alert>
    );
  }

  // If hub is connected or still loading, don't show anything
  return null;
}

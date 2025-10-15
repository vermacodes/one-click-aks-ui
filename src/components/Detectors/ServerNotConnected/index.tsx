import { useEffect, useState } from "react";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ServerNotConnected() {
  const { data: serverStatus, isLoading } = useServerStatus();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Don't show warning while loading
    if (isLoading) {
      setShowWarning(false);
      return;
    }

    // Show warning if server status is not OK (includes undefined/null)
    if (serverStatus?.status !== "OK") {
      // Small delay to avoid flashing on initial load
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Hide warning immediately when server is OK
      setShowWarning(false);
    }
  }, [serverStatus?.status, isLoading]);

  // If server is not connected, show warning
  if (showWarning) {
    return (
      <Alert variant="warning">
        <strong>⚠️ Server Not Connected:</strong> Unable to connect to the
        server.
      </Alert>
    );
  }

  // If server is connected, don't show anything
  return null;
}

import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ServerNotConnected() {
  const { isError } = useServerStatus();

  // If server is not connected, show warning
  if (isError) {
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

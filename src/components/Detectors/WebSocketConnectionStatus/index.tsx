import { useContext, useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useServerStatus } from "../../../hooks/useServerStatus";
import { WebSocketContext } from "../../Context/WebSocketContext";
import Alert from "../../UserInterfaceComponents/Alert";

export default function WebSocketConnectionStatus() {
	const { data: serverStatus, isError } = useServerStatus();
	const { actionStatusConnected, logStreamConnected } = useContext(WebSocketContext);
	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		// If both are connected, no need to show the warning
		if (actionStatusConnected && logStreamConnected) {
			setShowWarning(false);
			return;
		}

		// Set a timeout to show the warning after 10 seconds
		const timeoutId = setTimeout(() => {
			setShowWarning(true);
		}, 30000);

		// Clear the timeout if the component unmounts or if the connections change
		return () => clearTimeout(timeoutId);
	}, [actionStatusConnected, logStreamConnected]);

	// If server is not running, don't show the warning
	if (isError || serverStatus?.status !== "OK") {
		return null;
	}

	if (!showWarning) {
		return null;
	}

	return (
		<Alert variant="info">
			<div className="flex items-center gap-2">
				<ImSpinner10 className="animate-spin" />
				<strong>Connecting WebSockets:</strong> Please wait.. Use Help & Feedback if the problem continues.
			</div>
		</Alert>
	);
}

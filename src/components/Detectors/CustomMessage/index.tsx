import Alert from "../../UserInterfaceComponents/Alert";

export default function CustomMessage() {
	return (
		<Alert variant="danger">
			<strong>⚠️ Outage:</strong> ACT Labs is temporarily unavailable due to upstream security updates. We're working to
			resolve the issue. Please check back later.
		</Alert>
	);
}

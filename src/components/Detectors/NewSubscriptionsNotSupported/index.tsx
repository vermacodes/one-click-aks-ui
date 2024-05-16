import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Alert from "../../UserInterfaceComponents/Alert";

export default function NewSubscriptionsNotSupported() {
	const [read, setRead] = useState(false);

	if (read) {
		return <></>;
	}

	return (
		<Alert variant="warning">
			<div className="flex justify-between">
				⚠️ ACTLabs does not currently support new FDPO Subscriptions. We anticipate having support available by May 21,
				2024.
				<button onClick={() => setRead(true)} className="text-xl">
					<FaTimes />
				</button>
			</div>
		</Alert>
	);
}

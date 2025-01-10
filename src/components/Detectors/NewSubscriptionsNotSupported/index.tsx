import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ServerHosting } from "../../../dataStructures";
import { getDefaultServerHosting } from "../../../defaults";
import { useManagedServer } from "../../../hooks/useManagedServer";
import Alert from "../../UserInterfaceComponents/Alert";

export default function NewSubscriptionsNotSupported() {
	const [read, setRead] = useState(false);

	const [severHosting] = useState<ServerHosting>(getDefaultServerHosting());
	const { data: managedServer } = useManagedServer();

	if (read) {
		return <></>;
	}

	if (severHosting.environment === "docker" || managedServer?.version === "V3") {
		return <></>;
	}

	return (
		<Alert variant="warning">
			<div className="flex justify-between">
				<div className="flex-row">
					<strong>⚠️ The Managed Server cannot be used for Production Subscriptions.</strong>{" "}
					<span>
						Please consider switching to an FDPO Subscription or hosting the server yourself. To switch to an FDPO
						Subscription, you'll need to unregister the server and register it again under the new subscription. If you
						need assistance,{" "}
						<a className="text-blue-500 underline" href="https://app.msftactlabs.com/feedback">
							click here
						</a>
						.
					</span>
				</div>
				<button onClick={() => setRead(true)} className="text-xl">
					<FaTimes />
				</button>
			</div>
		</Alert>
	);
}

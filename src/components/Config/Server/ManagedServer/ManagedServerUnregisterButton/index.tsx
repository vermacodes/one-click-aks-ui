import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useWebSocketContext } from "../../../../Context/WebSocketContext";
import Button from "../../../../UserInterfaceComponents/Button";
import CodeBlock from "../../../../UserInterfaceComponents/CodeBlock";
import ConfirmationModal from "../../../../UserInterfaceComponents/Modal/ConfirmationModal";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {};

export default function ManagedServerUnregisterButton({}: Props) {
	const [confirmUnregister, setConfirmUnregister] = useState<boolean>(false);
	const { data: managedServer } = useManagedServer();
	const { lock, handleUnregister } = useDeployManagedServer();

	const { actionStatus } = useWebSocketContext();

	if (managedServer === undefined || (managedServer && managedServer.status === "Unregistered")) {
		return <ManagedServerRegistration />;
	}

	return (
		<>
			<Button
				variant="danger-text"
				onClick={() => setConfirmUnregister(true)}
				tooltipMessage="Unregister the managed server."
				tooltipDelay={1000}
				disabled={lock || actionStatus.inProgress}
				aria-label="Unregister subscription from Managed Server"
			>
				<FaTimes /> Unregister
			</Button>
			{confirmUnregister && (
				<ConfirmationModal
					title="Confirm Unregister"
					onConfirm={() => {
						setConfirmUnregister(false);
						handleUnregister();
					}}
					onClose={() => setConfirmUnregister(false)}
					closeLabel="Close Unregister Managed Server Modal"
					confirmLabel="Unregister Managed Server"
					cancelLabel="Cancel Unregister Managed Server"
				>
					<p className="text-xl">Are you sure you want to unregister the managed server?</p>
					<ul className="ml-4 list-disc space-y-2">
						<li className="text-sm">
							<span className="font-bold underline">IMPORTANT</span> 👉 Unregistering managed server will only delete
							associated managed server record from our database and storage account from your subscription. It will{" "}
							<span className="font-bold text-rose-500 underline">NOT</span> remove any roles.
						</li>
						<li className="text-sm">
							<p className="mb-2">
								To completely remove all roles and resources, use following script{" "}
								<span className="italic underline">after</span> unregister.
							</p>
							<CodeBlock
								codeString="curl -o actlabs.sh -sLO https://raw.githubusercontent.com/vermacodes/actlabs-hub/main/scripts/unregister.sh; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
								copyEnabled={true}
							/>
						</li>
					</ul>
				</ConfirmationModal>
			)}
		</>
	);
}

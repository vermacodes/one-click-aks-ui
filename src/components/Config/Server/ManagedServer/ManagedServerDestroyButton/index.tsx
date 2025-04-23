import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useWebSocketContext } from "../../../../Context/WebSocketContext";
import Button from "../../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../../UserInterfaceComponents/Modal/ConfirmationModal";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {};

export default function ManagedServerDestroyButton({}: Props) {
	const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);
	const { data: managedServer } = useManagedServer();
	const { lock, handleDestroy } = useDeployManagedServer();

	const { actionStatus } = useWebSocketContext();

	if (managedServer === undefined || (managedServer && managedServer.status === "Unregistered")) {
		return <ManagedServerRegistration />;
	}

	return (
		<>
			<Button variant="danger-text" disabled={lock || actionStatus.inProgress} onClick={() => setConfirmDestroy(true)} aria-label="Destroy Managed Server">
				<FaTrash /> Destroy
			</Button>
			{confirmDestroy && (
				<ConfirmationModal
					title="Confirm Destroy Server"
					onConfirm={() => {
						setConfirmDestroy(false);
						handleDestroy();
					}}
					onClose={() => setConfirmDestroy(false)}
					closeLabel="Close Destroy Managed Server Modal"
					confirmLabel="Destroy Managed Server"
					cancelLabel="Cancel Destroy Managed Server"
				>
					<p className="text-xl">Are you sure you want to destroy the managed server?</p>
					<ul className="ml-4 list-disc space-y-2">
						<li className="text-sm">
							<span className="font-bold underline">IMPORTANT</span> 👉 Managed server (ACI) change IP with each
							deployment. If server is running but not connected, wait 5 mins for DNS sync, then refresh; redeploy won't
							help.
						</li>
						<li className="text-sm">Server wont be deployed again automatically and you have to manually deploy it.</li>
						<li className="text-sm">
							Any deployments which are set to be auto-destroyed will not be destroyed until server is manually deployed
							again..
						</li>
					</ul>
				</ConfirmationModal>
			)}
		</>
	);
}

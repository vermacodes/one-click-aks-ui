import { FaRocket } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer } from "../../../../../dataStructures";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useAuth } from "../../../../Context/AuthContext";
import Button from "../../../../UserInterfaceComponents/Button";

type Props = {};

export default function ManagedServerDeployButton({}: Props) {
	const { graphResponse } = useAuth();
	const { data: managedServer } = useManagedServer();
	const { lock, handleDeploy } = useDeployManagedServer();

	function onDeployClick() {
		if (graphResponse === undefined) {
			toast.error("Failed to deploy managed server. User not authenticated.");
			return;
		}
		handleDeploy({
			userPrincipalName: graphResponse?.userPrincipalName,
			userPrincipalId: graphResponse?.id,
			logLevel: "-4",
		} as ManagedServer);
	}

	if (managedServer === undefined) {
		return null;
	}

	return (
		<Button
			variant="primary-text"
			disabled={lock || managedServer.status === "Running"}
			onClick={onDeployClick}
			aria-label="Deploy Managed Server"
			tooltipMessage={
				managedServer.status === "Running"
					? "Server is already running. If server was just deployed and status is 'Not Running', Please wait for DNS sync to complete and refresh the page after a few minutes. Re-deploy will not help."
					: undefined
			}
		>
			<FaRocket /> Deploy
		</Button>
	);
}

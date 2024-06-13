import { useState } from "react";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import Checkbox from "../../../../UserInterfaceComponents/Checkbox";
import ConfirmationModal from "../../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {};

export default function ManagedServerAutoDeployAndDestroy({}: Props) {
	const [confirmAutoDestroyDisabled, setConfirmAutoDestroyDisabled] = useState<boolean>(false);
	const { data: managedServer, isError } = useManagedServer();
	const { lock, handleUpdate } = useDeployManagedServer();

	function onAutoDestroyClick() {
		if (!managedServer) {
			return;
		}

		if (managedServer.autoDestroy) {
			setConfirmAutoDestroyDisabled(true);
			return;
		}

		handleUpdate({ ...managedServer, autoDestroy: true });
	}

	if (managedServer === undefined) {
		return null;
	}

	return (
		<>
			<Checkbox
				key={"autoDeploy"}
				tooltipDelay={500}
				tooltipMessage="Server will be deployed again when you become active if it was automatically destroyed due to inactivity."
				label="Auto Deploy"
				id="autoDeploy"
				checked={managedServer.autoCreate}
				handleOnChange={() => handleUpdate({ ...managedServer, autoCreate: !managedServer.autoCreate })}
				disabled={isError || lock}
			/>
			<Checkbox
				key={"autoDestroy"}
				tooltipDelay={500}
				tooltipMessage="Server will be will be automatically destroyed if no activity for an hour. Not available for V2 servers."
				label="Auto Destroy"
				id="autoDestroy"
				checked={managedServer.autoDestroy}
				handleOnChange={onAutoDestroyClick}
				disabled={isError || lock || managedServer.version !== "V1"}
			/>
			{confirmAutoDestroyDisabled && (
				<ConfirmationModal
					title="Confirm Disable Auto Destroy"
					onConfirm={() => {
						setConfirmAutoDestroyDisabled(false);
						handleUpdate({ ...managedServer, autoDestroy: false });
					}}
					onClose={() => setConfirmAutoDestroyDisabled(false)}
				>
					<p className="text-xl">Are you sure you want to disable auto destroy?</p>
					<p className="text-sm">
						Please note that, when auto destroy is disabled, server wont be automatically destroyed and you may incur
						unnecessary cost.
					</p>
				</ConfirmationModal>
			)}
		</>
	);
}

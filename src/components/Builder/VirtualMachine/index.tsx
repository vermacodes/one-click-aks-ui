import { useContext, useEffect, useState } from "react";
import { getDefaultTfvarConfig } from "../../../defaults";
import { useSetLogs } from "../../../hooks/useLogs";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import { WebSocketContext } from "../../Context/WebSocketContext";
import Checkbox from "../../UserInterfaceComponents/Checkbox";

export default function VirtualMachine() {
	const [tooltipMessage, setTooltipMessage] = useState<string>("");
	const { actionStatus } = useContext(WebSocketContext);
	const { mutate: setLogs } = useSetLogs();
	const { lab, setLab } = useGlobalStateContext();

	const noVirtualNetworksMessage = "Virtual Network Required.";

	// Function to handle changes in the checkbox
	const handleOnChange = () => {
		const newLab = structuredClone(lab);
		if (newLab?.template) {
			// Toggle the jump servers
			newLab.template.jumpservers = newLab.template.jumpservers.length === 0 ? getDefaultTfvarConfig().jumpservers : [];

			// Log the changes if not in progress
			!actionStatus.inProgress && setLogs({ logs: JSON.stringify(newLab.template, null, 4) });

			// Update the newLab
			setLab(newLab);
		}
	};

	useEffect(() => {
		if (
			lab &&
			lab.template &&
			lab.template.virtualNetworks.length === 0 &&
			tooltipMessage !== noVirtualNetworksMessage
		) {
			setTooltipMessage(noVirtualNetworksMessage);
		} else if (lab && lab.template && lab.template.virtualNetworks.length > 0 && tooltipMessage) {
			setTooltipMessage("");
		}
	}, [lab, tooltipMessage]);

	// Define the checked state
	const checked = (lab?.template?.jumpservers?.length ?? 0) > 0;

	// Define the disabled state
	var disabled: boolean = false;
	if (lab && lab.template && lab.template.virtualNetworks.length === 0) {
		disabled = true;
	}

	return lab?.template ? (
		<Checkbox
			id="toggle-jumpserver"
			label="Jump Server"
			checked={checked}
			disabled={disabled}
			handleOnChange={handleOnChange}
			tooltipMessage={tooltipMessage}
		/>
	) : null;
}

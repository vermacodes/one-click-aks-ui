import { useContext } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../../../Context/WebSocketContext";
import NumberInput from "../../../../../UserInterfaceComponents/NumberInput";

type Props = {
	index: number;
};

export default function DefaultNodepoolMin({ index }: Props) {
	const { lab, setLab } = useGlobalStateContext();
	const { actionStatus } = useContext(WebSocketContext);
	const { mutate: setLogs } = useSetLogs();

	// Toggle the auto scaling feature
	const handleOnChange = (value: string) => {
		const newLab = structuredClone(lab);
		const cluster = newLab?.template?.kubernetesClusters[index];
		if (cluster?.defaultNodePool?.enableAutoScaling && newLab !== undefined) {
			cluster.defaultNodePool.minCount = parseInt(value);
			!actionStatus.inProgress && setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
			setLab(newLab);
		}
	};

	// Determine checked and disabled states
	const disabled =
		!lab?.template?.kubernetesClusters[index] ||
		!lab?.template?.kubernetesClusters[index]?.defaultNodePool?.enableAutoScaling;

	return (
		<NumberInput
			label="Min Nodes"
			placeholder="1"
			type="number"
			min={1}
			max={100}
			disabled={disabled}
			onChange={(e) => handleOnChange(e.target.value)}
		/>
	);
}

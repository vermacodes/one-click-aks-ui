import { useContext, useEffect, useState } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../../../Context/WebSocketContext";
import NumberInput from "../../../../../UserInterfaceComponents/NumberInput";

type Props = {
	index: number;
};

export default function DefaultNodepoolMax({ index }: Props) {
	const [count, setCount] = useState(1);

	const { lab, setLab } = useGlobalStateContext();
	const { actionStatus } = useContext(WebSocketContext);
	const { mutate: setLogs } = useSetLogs();

	// Update teh count when the lab or index changes.
	useEffect(() => {
		setCount(lab?.template?.kubernetesClusters[index]?.defaultNodePool?.maxCount || 1);
	}, [lab, index]);

	// Toggle the auto scaling feature
	const handleOnChange = (value: string) => {
		let parsedValue = parseInt(value);
		const newLab = structuredClone(lab);
		const cluster = newLab?.template?.kubernetesClusters[index];

		setCount(parsedValue);

		if (!cluster?.defaultNodePool?.enableAutoScaling || isNaN(parsedValue) || parsedValue === 0) {
			return;
		}

		if (parsedValue > 10) {
			parsedValue = 10;
		}

		cluster.defaultNodePool.maxCount = parsedValue;

		if (cluster.defaultNodePool.minCount > parsedValue) {
			cluster.defaultNodePool.minCount = parsedValue;
		}

		if (!actionStatus.inProgress) {
			setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
		}

		setLab(newLab);
	};

	// Determine checked and disabled states
	const disabled = !lab?.template?.kubernetesClusters[index]?.defaultNodePool?.enableAutoScaling;

	return (
		<div>
			<NumberInput
				label="Max Nodes"
				type="number"
				min={1}
				max={10}
				value={count}
				disabled={disabled}
				onChange={(e) => handleOnChange(e.target.value)}
				onBlur={() => setCount(lab?.template?.kubernetesClusters[index]?.defaultNodePool?.maxCount || 1)}
			/>
		</div>
	);
}

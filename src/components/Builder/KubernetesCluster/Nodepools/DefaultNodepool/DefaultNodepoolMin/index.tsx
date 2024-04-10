import { useContext, useEffect, useState } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../../../Context/WebSocketContext";
import NumberInput from "../../../../../UserInterfaceComponents/NumberInput";

type Props = {
	index: number;
};

export default function DefaultNodepoolMin({ index }: Props) {
	const [count, setCount] = useState(1);

	const { lab, setLab } = useGlobalStateContext();
	const { actionStatus } = useContext(WebSocketContext);
	const { mutate: setLogs } = useSetLogs();

	useEffect(() => {
		setCount(lab?.template?.kubernetesClusters[index]?.defaultNodePool?.minCount || 1);
	}, [lab, index]);

	const handleOnChange = (value: string) => {
		const parsedValue = parseInt(value);
		const newLab = structuredClone(lab);
		const cluster = newLab?.template?.kubernetesClusters[index];

		setCount(parsedValue);

		if (!cluster?.defaultNodePool?.enableAutoScaling || isNaN(parsedValue) || parsedValue === 0) {
			return;
		}

		cluster.defaultNodePool.minCount = parsedValue;

		if (cluster.defaultNodePool.maxCount < parsedValue) {
			cluster.defaultNodePool.maxCount = parsedValue;
		}

		if (!actionStatus.inProgress) {
			setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
		}

		setLab(newLab);
	};

	const disabled = !lab?.template?.kubernetesClusters[index]?.defaultNodePool?.enableAutoScaling;

	return (
		<NumberInput
			label="Min Nodes"
			type="number"
			min={1}
			max={100}
			value={count}
			disabled={disabled}
			onChange={(e) => handleOnChange(e.target.value)}
			onBlur={() => setCount(lab?.template?.kubernetesClusters[index]?.defaultNodePool?.minCount || 1)}
		/>
	);
}

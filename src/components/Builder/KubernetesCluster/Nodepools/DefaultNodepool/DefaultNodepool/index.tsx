import AutoScaling from "../../AutoScaling";
import DefaultNodepoolMax from "../DefaultNodepoolMax";
import DefaultNodepoolMin from "../DefaultNodepoolMin";

type Props = {
	index: number;
};

export default function DefaultNodePool({ index }: Props) {
	return (
		<div className="flex items-center gap-4">
			<AutoScaling index={index} />
			<DefaultNodepoolMin index={index} />
			<DefaultNodepoolMax index={index} />
		</div>
	);
}
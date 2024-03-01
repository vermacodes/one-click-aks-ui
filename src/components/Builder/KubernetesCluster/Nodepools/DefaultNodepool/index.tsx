import AutoScaling from "../AutoScaling";
import DefaultNodepoolMin from "./DefaultNodepoolMin";

type Props = {
	index: number;
};

export default function DefaultNodePool({ index }: Props) {
	return (
		<div>
			<AutoScaling index={index} />
			<DefaultNodepoolMin index={index} />
		</div>
	);
}

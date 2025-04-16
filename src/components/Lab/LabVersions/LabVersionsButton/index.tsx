import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ButtonVariant, Lab } from "../../../../dataStructures";

type Props = {
	variant?: ButtonVariant;
	lab: Lab;
};

export default function LabVersionsButton({ variant = "secondary-text", lab }: Props) {
	return (
		<Link
			to={"/lab/versions/" + lab.type + "/" + lab.id}
			className="text-bold flex items-center gap-2 whitespace-nowrap rounded px-3 py-1 text-gray-700 ring-0 focus-visible:outline-2 disabled:text-slate-400 hover:bg-gray-500 hover:bg-opacity-20 hover:ring-1 hover:ring-gray-500 dark:text-gray-400 dark:disabled:text-slate-500 dark:hover:bg-gray-400 dark:hover:bg-opacity-20 dark:hover:ring-gray-400"
		>
			<FaHistory /> Versions
		</Link>
	);
}

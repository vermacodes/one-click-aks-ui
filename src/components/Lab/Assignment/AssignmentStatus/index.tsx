import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Assignment } from "../../../../dataStructures";

type Props = {
	assignment: Assignment;
};

export default function AssignmentStatus({ assignment }: Props) {
	if (assignment.status === "Created") {
		return (
			<span className="flex items-center gap-2">
				<FaCheckCircle className="text-sky-500" /> Created
			</span>
		);
	}
	if (assignment.status === "InProgress") {
		return (
			<span className="flex items-center gap-2">
				<FaCheckCircle className="text-purple-500" /> In Progress
			</span>
		);
	}
	if (assignment.status === "Completed") {
		return (
			<span className="flex items-center gap-2">
				<FaCheckCircle className="text-green-500" /> Completed
			</span>
		);
	}

	return (
		<span className="flex items-center gap-2">
			<FaExclamationCircle className="text-yellow-500" /> Unknown
		</span>
	);
}

import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Assignment } from "../../../../dataStructures";

type Props = {
  assignment: Assignment;
};

export default function AssignmentStatus({ assignment }: Props) {
  if (assignment.status === "Created") {
    return (
      <span className="flex items-center gap-2">
        <FaCheckCircle className="text-sky-700 dark:text-sky-400" /> Created
      </span>
    );
  }
  if (assignment.status === "InProgress") {
    return (
      <span className="flex items-center gap-2">
        <FaCheckCircle className="text-purple-700 dark:text-purple-400" /> In
        Progress
      </span>
    );
  }
  if (assignment.status === "Completed") {
    return (
      <span className="flex items-center gap-2">
        <FaCheckCircle className="text-green-700 dark:text-green-400" />{" "}
        Completed
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <FaExclamationCircle className="text-yellow-700 dark:text-yellow-400" />{" "}
      Unknown
    </span>
  );
}

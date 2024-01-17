import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Assignment } from "../../../../dataStructures";
import { useDeleteMyAssignment } from "../../../../hooks/useAssignment";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
  assignment: Assignment;
};

export default function DeleteMyAssignment({ assignment }: Props) {
  const { mutateAsync: deleteMyAssignment } = useDeleteMyAssignment();

  function handleDeleteMyAssignment(assignment: Assignment) {
    let assignmentIds: string[] = [];
    assignmentIds.push(assignment.assignmentId);

    toast.promise(deleteMyAssignment(assignmentIds), {
      pending: "Deleting Assignment...",
      success: "Assignment Deleted.",
      error: {
        render(data: any) {
          return `Failed to delete assignment. ${data.data.response.data.error}`;
        },
      },
    });
  }
  return (
    <Button variant="danger-text" onClick={() => handleDeleteMyAssignment(assignment)}>
      <FaTrash /> Delete
    </Button>
  );
}

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Assignment } from "../../../../dataStructures";
import { defaultLinkTextStyle, getUIStateColors } from "../../../../defaults";
import {
  useDeleteMyAssignment,
  useGetAllReadinessLabsRedacted,
  useGetMyAssignments,
} from "../../../../hooks/useAssignment";
import { cn } from "../../../../utils/cn";
import Button from "../../../UserInterfaceComponents/Button";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";
import AssignmentStatus from "../AssignmentStatus";
import DeleteMyAssignment from "../DeleteMyAssignment";

type Props = {};

export default function ListAssignment({}: Props) {
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>(
    [],
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const { data: myAssignments } = useGetMyAssignments();
  const { data: labs } = useGetAllReadinessLabsRedacted();
  const { mutateAsync: deleteMyAssignments } = useDeleteMyAssignment();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (myAssignments) {
      const myAssignmentsMap = new Map(
        myAssignments.map((assignment) => [
          assignment.assignmentId,
          assignment,
        ]),
      );
      setAssignments(Array.from(myAssignmentsMap.values()));
    }
  }, [myAssignments]);

  function handleDeleteSelected() {
    setConfirmationModalOpen(false);
    let assignmentIds = selectedAssignments.map(
      (assignment) => assignment.assignmentId,
    );

    const response = toast.promise(deleteMyAssignments(assignmentIds), {
      pending: "Deleting Assignments...",
      success: "Assignments Deleted.",
      error: {
        render(data: any) {
          return `Failed to delete assignments. ${data.data.response.data.error}`;
        },
      },
    });

    response
      .then(() => {
        // remove selected assignments from assignments state.
        let newAssignments = assignments.filter(
          (assignment) => !assignmentIds.includes(assignment.assignmentId),
        );
        setAssignments(newAssignments);

        // remove selected assignments from selectedAssignments state.
        setSelectedAssignments([]);
      })
      .finally(() => {
        // invalidate all lab id queries.
        selectedAssignments.forEach((assignment) => {
          queryClient.invalidateQueries([
            "get-assignments-by-lab-id",
            assignment.labId,
          ]);
          queryClient.invalidateQueries([
            "get-assignments-by-user-id",
            assignment.userId,
          ]);
          queryClient.invalidateQueries([
            "get-readiness-labs-redacted-by-user-id",
            assignment.userId,
          ]);
        });
        queryClient.invalidateQueries([
          "get-readiness-labs-redacted-by-user-id",
          "my",
        ]);
        queryClient.invalidateQueries("get-my-assignments");
        queryClient.invalidateQueries("get-assignments");
      });
  }

  function getLabName(labId: string) {
    if (labs) {
      const lab = labs.find((lab) => lab.id === labId);
      if (lab) {
        return lab.name;
      }
    }
    return "";
  }

  if (
    assignments &&
    assignments.filter((assignment) => assignment.status !== "Deleted")
      .length === 0
  ) {
    return (
      <Container title="My Assignments" collapsible={true}>
        <p className="text-slate-500">
          You have no assignments. Self-assign readiness labs using 'Create
          Self-Assignments' above ☝️ or ask your TA/Mentor to help you.
        </p>
      </Container>
    );
  }

  return (
    <Container
      title="My Assignments"
      collapsible={true}
      additionalContainerBodyClasses="h-fit overflow-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-200 scrollbar-track-rounded dark:scrollbar-thumb-slate-700 scrollbar-thumb-rounded dark:scrollbar-track-slate-900"
    >
      <div className="flex justify-end p-4">
        <Button
          variant="danger-outline"
          disabled={selectedAssignments.length === 0}
          onClick={() => setConfirmationModalOpen(true)}
        >
          <FaTrash /> Delete Selected
        </Button>
        {confirmationModalOpen && (
          <ConfirmationModal
            onConfirm={handleDeleteSelected}
            onClose={() => setConfirmationModalOpen(false)}
            title="Confirm Delete All Assignments"
            closeLabel="Close delete all assignments modal"
            confirmLabel="Confirm deletion of all assignments"
            cancelLabel="Cancel assignment deletion"
          >
            <p className="text-xl text-slate-400">
              Are you sure you want to delete all the selected assignments? This
              is not reversible.
            </p>
          </ConfirmationModal>
        )}
      </div>
      <table className="h-full w-full table-auto border-separate space-x-2 overflow-auto">
        <thead>
          <tr key={"tableHead"}>
            <th>
              <Checkbox
                id={"selectAll"}
                label="Select All"
                handleOnChange={
                  selectedAssignments.length === assignments?.length
                    ? () => setSelectedAssignments([])
                    : () => setSelectedAssignments(assignments || [])
                }
                checked={
                  selectedAssignments.length === assignments?.length &&
                  selectedAssignments.length !== 0
                }
                disabled={assignments?.length === 0}
              />
            </th>
            <th className="space-x-2 px-4 py-2 text-left">Lab Name</th>
            <th className="space-x-2 px-4 py-2 text-left">User</th>
            <th className="space-x-2 px-4 py-2 text-left">Status</th>
            <th className="space-x-2 px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments &&
            assignments
              .filter((assignment) => assignment.status !== "Deleted")
              .map((assignment) => (
                <tr
                  key={assignment.assignmentId + assignment.userId}
                  className={getUIStateColors({
                    hover: true,
                  })}
                >
                  <td>
                    <Checkbox
                      id={assignment.assignmentId}
                      label="Select Assignment"
                      handleOnChange={
                        selectedAssignments.includes(assignment)
                          ? () =>
                              setSelectedAssignments(
                                selectedAssignments.filter(
                                  (i) => i !== assignment,
                                ),
                              )
                          : () =>
                              setSelectedAssignments([
                                ...selectedAssignments,
                                assignment,
                              ])
                      }
                      checked={selectedAssignments.includes(assignment)}
                    />
                  </td>

                  <td
                    className={cn("space-x-2 px-4 py-2", defaultLinkTextStyle)}
                  >
                    <Link to={`/lab/readinesslab/${assignment.labId}`}>
                      {getLabName(assignment.labId)}
                    </Link>
                  </td>
                  <td className="space-x-2 px-4 py-2">{assignment.userId}</td>
                  <td className="space-x-2 px-4 py-2">
                    <AssignmentStatus assignment={assignment} />
                  </td>
                  <td className="space-x-2 px-4 py-2">
                    <DeleteMyAssignment assignment={assignment} />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </Container>
  );
}

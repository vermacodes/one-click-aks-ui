import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTrash } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Assignment } from "../../../../dataStructures";
import {
	useDeleteMyAssignment,
	useGetAllReadinessLabsRedacted,
	useGetMyAssignments,
} from "../../../../hooks/useAssignment";
import Button from "../../../UserInterfaceComponents/Button";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";
import DeleteMyAssignment from "../DeleteMyAssignment";

type Props = {};

export default function ListAssignment({}: Props) {
	const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

	const { data: myAssignments } = useGetMyAssignments();
	const { data: labs } = useGetAllReadinessLabsRedacted();
	const { mutateAsync: deleteMyAssignments } = useDeleteMyAssignment();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (myAssignments) {
			const myAssignmentsMap = new Map(myAssignments.map((assignment) => [assignment.assignmentId, assignment]));
			setAssignments(Array.from(myAssignmentsMap.values()));
		}
	}, [myAssignments]);

	function handleDeleteSelected() {
		setConfirmationModalOpen(false);
		let assignmentIds = selectedAssignments.map((assignment) => assignment.assignmentId);

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
				let newAssignments = assignments.filter((assignment) => !assignmentIds.includes(assignment.assignmentId));
				setAssignments(newAssignments);

				// remove selected assignments from selectedAssignments state.
				setSelectedAssignments([]);
			})
			.finally(() => {
				// invalidate all lab id queries.
				selectedAssignments.forEach((assignment) => {
					queryClient.invalidateQueries(["get-assignments-by-lab-id", assignment.labId]);
					queryClient.invalidateQueries(["get-assignments-by-user-id", assignment.userId]);
					queryClient.invalidateQueries(["get-readiness-labs-redacted-by-user-id", assignment.userId]);
				});
				queryClient.invalidateQueries(["get-readiness-labs-redacted-by-user-id", "my"]);
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

	function assignmentStatus(assignment: Assignment) {
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

	if (assignments && assignments.filter((assignment) => assignment.status !== "Deleted").length === 0) {
		return (
			<Container title="My Assignments" collapsible={true}>
				<p className="text-xl">
					You have no assignments. Self-assign readiness labs using 'Create Assignment' above ☝️ or ask your TA/Mentor
					to help you.
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
					>
						<p className="text-xl text-slate-400">
							Are you sure you want to delete all the selected assignments? This is not reversible.
						</p>
					</ConfirmationModal>
				)}
			</div>
			<table className="h-full w-full table-auto border-separate space-x-2 overflow-auto bg-slate-50 py-2 dark:bg-slate-900">
				<thead>
					<tr key={"tableHead"}>
						<th>
							<Checkbox
								id={"selectAll"}
								label=""
								handleOnChange={
									selectedAssignments.length === assignments?.length
										? () => setSelectedAssignments([])
										: () => setSelectedAssignments(assignments || [])
								}
								checked={selectedAssignments.length === assignments?.length && selectedAssignments.length !== 0}
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
									className="hover:bg-slate-100 hover:dark:bg-slate-800"
								>
									<td>
										<Checkbox
											id={assignment.assignmentId}
											label=""
											handleOnChange={
												selectedAssignments.includes(assignment)
													? () => setSelectedAssignments(selectedAssignments.filter((i) => i !== assignment))
													: () => setSelectedAssignments([...selectedAssignments, assignment])
											}
											checked={selectedAssignments.includes(assignment)}
										/>
									</td>
									<td className="space-x-2 px-4 py-2 hover:text-sky-500 hover:underline">
										<Link to={`/lab/assignment/${assignment.labId}`}>{getLabName(assignment.labId)}</Link>
									</td>
									<td className="space-x-2 px-4 py-2">{assignment.userId}</td>
									<td className="space-x-2 px-4 py-2">{assignmentStatus(assignment)}</td>
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

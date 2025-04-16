import { ReactNode, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Assignment } from "../../../../dataStructures";
import { defaultScrollbarStyle } from "../../../../defaults";
import {
	useDeleteAssignment,
	useGetAllReadinessLabsRedacted,
	useGetAssignments,
} from "../../../../hooks/useAssignment";
import { useGetAllProfilesRedacted } from "../../../../hooks/useProfile";
import ProfileDisplay from "../../../Authentication/ProfileDisplay";
import Button from "../../../UserInterfaceComponents/Button";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";
import FilterTextBox from "../../../UserInterfaceComponents/FilterTextBox";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";
import AssignmentStatus from "../AssignmentStatus";
import DeleteAssignment from "../DeleteAssignment";
import ExportAssignments from "../ExportAssignments";

type Props = {};

export default function ListAssignment({}: Props) {
	const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [filterText, setFilterText] = useState<string>("");
	const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

	const { data: profiles } = useGetAllProfilesRedacted();
	const { data: allAssignments } = useGetAssignments();
	const { data: labs } = useGetAllReadinessLabsRedacted();
	const { mutateAsync: deleteAssignments } = useDeleteAssignment();
	const queryClient = useQueryClient();

	/**
	 * This useEffect hook is triggered when either allAssignments or profiles change.
	 * It maps over allAssignments and for each assignment, it finds the corresponding profile.
	 * It then creates a new object that is a copy of the assignment with the displayName added from the profile.
	 * If the profile doesn't exist, it uses an empty string for the displayName.
	 * It then creates a Map where the keys are assignmentIds and the values are the assignments.
	 * This effectively removes any duplicate assignments.
	 * Finally, it updates the assignments state with the unique assignments.
	 */
	useEffect(() => {
		if (allAssignments && profiles && labs) {
			const updatedAssignments = allAssignments.map((assignment) => {
				const profile = profiles.find((profile) => profile.userPrincipal === assignment.userId);
				const lab = labs.find((lab) => lab.id === assignment.labId);
				return {
					...assignment,
					displayName: profile ? profile.displayName : "",
					labName: lab ? lab.name : "",
				};
			});

			const assignmentsMap = new Map(updatedAssignments.map((assignment) => [assignment.assignmentId, assignment]));
			setAssignments(Array.from(assignmentsMap.values()));
		}
	}, [allAssignments, profiles, labs]);

	function handleDeleteSelected() {
		setConfirmationModalOpen(false);
		let assignmentIds = selectedAssignments.map((assignment) => assignment.assignmentId);

		const response = toast.promise(deleteAssignments(assignmentIds), {
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

	function getProfileByUserPrincipal(userPrincipal: string): ReactNode | string {
		const profile = profiles?.find((profile) => profile.userPrincipal === userPrincipal);
		if (!profile) {
			return userPrincipal;
		}
		return <ProfileDisplay profile={profile} size="small" />;
	}

	return (
		<Container
			title="All Assignments"
			collapsible={true}
			additionalContainerBodyClasses={`h-fit overflow-auto ${defaultScrollbarStyle}`}
		>
			<div className="flex justify-end gap-4 px-1 py-4">
				<FilterTextBox
					value={filterText}
					onChange={setFilterText}
					placeHolderText="Filter assignments by lab name, user, or status"
					customClasses="py-1 ring-1 ring-slate-500 hover:ring-sky-500 focus:ring-sky-500 border-0"
				/>
				<ExportAssignments assignments={allAssignments} />
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
						title="Confirm Delete Selected Assignments"
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
								label="Select All"
								handleOnChange={
									selectedAssignments.length === assignments?.length
										? () => setSelectedAssignments([])
										: () => setSelectedAssignments(assignments || [])
								}
								checked={selectedAssignments.length === assignments?.length && selectedAssignments.length !== 0}
								disabled={assignments?.length === 0}
								aria-label="Select all assignments"
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
							.filter((assignment) =>
								Object.values(assignment).some((value) =>
									value.toString().toLowerCase().includes(filterText.toLowerCase())
								)
							)
							.map((assignment) => (
								<tr
									key={assignment.assignmentId + assignment.userId}
									className="hover:bg-slate-100 hover:dark:bg-slate-800"
								>
									<td>
										<Checkbox
											id={assignment.assignmentId}
											label="Select Assignment"
											handleOnChange={
												selectedAssignments.includes(assignment)
													? () => setSelectedAssignments(selectedAssignments.filter((i) => i !== assignment))
													: () => setSelectedAssignments([...selectedAssignments, assignment])
											}
											checked={selectedAssignments.includes(assignment)}
											aria-label={"Select assignment " + assignment.assignmentId}
										/>
									</td>
									<td className="space-x-2 px-4 py-2 text-sky-700 underline dark:text-sky-400">
										<Link to={`/lab/readinesslab/${assignment.labId}`}>{assignment.labName}</Link>
									</td>
									<td className="space-x-2 px-4 py-2">{getProfileByUserPrincipal(assignment.userId)}</td>
									<td className="space-x-2 px-4 py-2">
										<AssignmentStatus assignment={assignment} />
									</td>
									<td className="space-x-2 px-4 py-2">
										<DeleteAssignment assignment={assignment} />
									</td>
								</tr>
							))}
				</tbody>
			</table>
		</Container>
	);
}

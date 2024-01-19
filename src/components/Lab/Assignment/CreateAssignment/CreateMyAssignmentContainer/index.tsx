import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BulkAssignment, Lab } from "../../../../../dataStructures";
import { useCreateAssignments, useCreateMyAssignments } from "../../../../../hooks/useAssignment";
import { useGetMyProfile } from "../../../../../hooks/useProfile";
import Button from "../../../../UserInterfaceComponents/Button";
import Container from "../../../../UserInterfaceComponents/Container";
import SelectLabsDropdown from "../SelectLabsDropdown";

export default function CreateMyAssignmentContainer() {
	const { mutateAsync: createBulkAssignments } = useCreateAssignments();
	const { mutateAsync: createMyBulkAssignments } = useCreateMyAssignments();
	const { data: myProfile } = useGetMyProfile();

	const queryClient = useQueryClient();

	const [selectedLabs, setSelectedLabs] = useState<Lab[]>([]);

	function onAssignClick() {
		if (myProfile === undefined) {
			toast.error("not able to pull profile to assign");
			return;
		}

		let bulkAssignments: BulkAssignment = {
			labIds: selectedLabs.map((lab) => lab.id),
			userIds: [myProfile.userPrincipal],
		};

		// let response: Promise<AxiosResponse<any, any>>;

		const response = toast.promise(
			myProfile.roles.includes("mentor")
				? createBulkAssignments(bulkAssignments)
				: createMyBulkAssignments(bulkAssignments),
			{
				pending: "Creating assignments...",
				success: "Assignments created!",
				error: {
					render(data: any) {
						return `Error creating assignments. ${data.data.response.data.error}`;
					},
					autoClose: 5000,
				},
			}
		);
		response.finally(() => {
			// invalidate all lab id queries.
			selectedLabs.forEach((lab) => {
				queryClient.invalidateQueries(["get-assignments-by-lab-id", lab.id]);
			});

			// invalidate all user id queries.
			queryClient.invalidateQueries(["get-readiness-labs-redacted-by-user-id", "my"]);
			queryClient.invalidateQueries("get-my-assignments");

			setSelectedLabs([]);
		});
	}

	return (
		<Container title="Create Assignment" collapsible={true}>
			<div className="mb-4 flex w-full flex-col justify-between gap-4 bg-slate-50 dark:bg-slate-900 md:flex-row">
				<SelectLabsDropdown selectedLabs={selectedLabs} setSelectedLabs={setSelectedLabs} />
				<div className="flex">
					<Button variant="primary-outline" onClick={onAssignClick}>
						<FaCheck /> Assign
					</Button>
				</div>
			</div>
			{myProfile?.roles.includes("mentor") && (
				<div className="w-fit rounded border border-sky-400 bg-sky-500 bg-opacity-10 px-2 py-1 text-xs dark:border-sky-600">
					✨ To create assignments for other users, please use the{" "}
					<Link to={"/assignments"} className="text-sky-400 underline dark:text-sky-600">
						Assignments
					</Link>{" "}
					page.
				</div>
			)}
		</Container>
	);
}

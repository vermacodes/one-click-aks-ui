import { useEffect } from "react";
import CreateAssignmentContainer from "../../components/Lab/Assignment/CreateAssignment/CreateAssignmentContainer";
import ListAssignment from "../../components/Lab/Assignment/ListAssignment";
import { useGetMyProfile } from "../../hooks/useProfile";
import PageLayout from "../../layouts/PageLayout";

type Props = {};

export default function Assignments({}: Props) {
	const { data: myProfile } = useGetMyProfile();

	useEffect(() => {
		document.title = "ACT Labs | Assignments";
	}, []);

	if (myProfile === undefined || !myProfile?.roles.includes("mentor")) {
		return (
			<PageLayout heading="Lab Assignments">
				<p className="text-xl">✋ You don't have permission to access this page.</p>
			</PageLayout>
		);
	}

	return (
		<PageLayout heading="Lab Assignments">
			<div className="flex flex-col gap-4">
				<CreateAssignmentContainer />
				<ListAssignment />
			</div>
		</PageLayout>
	);
}

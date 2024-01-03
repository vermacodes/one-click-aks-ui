import { useEffect } from "react";
import CreateMyAssignmentContainer from "../../components/Lab/Assignment/CreateAssignment/CreateMyAssignmentContainer";
import ListMyAssignment from "../../components/Lab/Assignment/ListMyAssignment";
import Terminal from "../../components/Terminal";
import { useGetMyProfile } from "../../hooks/useProfile";
import PageLayout from "../../layouts/PageLayout";

type Props = {};

export default function MyAssignments({}: Props) {
  const { data: myProfile } = useGetMyProfile();

  useEffect(() => {
    document.title = "ACT Labs | My Assignments";
  }, []);

  if (myProfile === undefined || !myProfile?.roles.includes("mentor")) {
    return (
      <PageLayout heading="Lab Assignments">
        <p className="text-xl">✋ You don't have permission to access this page.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout heading="My Readiness Lab Assignments">
      <div className="flex flex-col gap-4">
        <CreateMyAssignmentContainer />
        <ListMyAssignment />
      </div>
      <Terminal />
    </PageLayout>
  );
}

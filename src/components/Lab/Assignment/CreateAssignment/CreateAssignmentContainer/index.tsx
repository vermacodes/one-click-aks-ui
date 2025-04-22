import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { BulkAssignment, Lab, Profile } from "../../../../../dataStructures";
import {
  useCreateAssignments,
  useCreateMyAssignments,
} from "../../../../../hooks/useAssignment";
import { useGetMyProfile } from "../../../../../hooks/useProfile";
import Button from "../../../../UserInterfaceComponents/Button";
import Container from "../../../../UserInterfaceComponents/Container";
import SelectLabsDropdown from "../SelectLabsDropdown";
import SelectProfilesDropdown from "../SelectProfilesDropdown";

export default function CreateAssignmentContainer() {
  const { mutateAsync: createBulkAssignments } = useCreateAssignments();
  const { mutateAsync: createMyBulkAssignments } = useCreateMyAssignments();
  const { data: myProfile } = useGetMyProfile();

  const queryClient = useQueryClient();

  const [selectedLabs, setSelectedLabs] = useState<Lab[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);

  function onAssignClick() {
    if (myProfile === undefined) {
      toast.error("not able to pull profile to assign");
      return;
    }

    let bulkAssignments: BulkAssignment = {
      labIds: selectedLabs.map((lab) => lab.id),
      userIds: selectedProfiles.map((profile) => profile.userPrincipal),
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
      },
    );
    response.finally(() => {
      // invalidate all lab id queries.
      selectedLabs.forEach((lab) => {
        queryClient.invalidateQueries(["get-assignments-by-lab-id", lab.id]);
      });

      // invalidate all user id queries.
      selectedProfiles.forEach((user) => {
        queryClient.invalidateQueries(["get-assignments-by-user-id", user]);
        queryClient.invalidateQueries(["get-assignments-by-user-id", user]);
        queryClient.invalidateQueries([
          "get-readiness-labs-redacted-by-user-id",
          user,
        ]);
        queryClient.invalidateQueries([
          "get-readiness-labs-redacted-by-user-id",
          "my",
        ]);
        queryClient.invalidateQueries("get-my-assignments");
      });

      setSelectedLabs([]);
      setSelectedProfiles([]);
    });
  }

  return (
    <Container title="Create Assignment" collapsible={true}>
      <div className="mb-4 flex w-full flex-col justify-between gap-4 bg-slate-50 md:flex-row dark:bg-slate-900">
        <SelectLabsDropdown
          selectedLabs={selectedLabs}
          setSelectedLabs={setSelectedLabs}
        />
        <SelectProfilesDropdown
          selectedProfiles={selectedProfiles}
          setSelectedProfiles={setSelectedProfiles}
        />
        <div className="flex">
          <Button variant="primary-text" onClick={onAssignClick}>
            <FaCheck /> Assign
          </Button>
        </div>
      </div>
    </Container>
  );
}

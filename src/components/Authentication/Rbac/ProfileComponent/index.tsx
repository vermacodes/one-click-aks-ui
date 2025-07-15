import { useState } from "react";
import { toast } from "react-toastify";
import { Profile, ProfileMutation } from "../../../../dataStructures";
import { getUIStateColors } from "../../../../defaults";
import { useAddRole, useRemoveRole } from "../../../../hooks/useProfile";
import { cn } from "../../../../utils/cn";
import Button from "../../../UserInterfaceComponents/Button";
import Container from "../../../UserInterfaceComponents/Container";
import ProfileDisplay from "../../ProfileDisplay";

type Props = {
  profile: Profile;
};

export default function ProfileComponent({ profile }: Props) {
  const [addRoleFlag, setAddRoleFlag] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");

  const { mutateAsync: removeRole } = useRemoveRole();
  const { mutateAsync: addRole } = useAddRole();

  function handleRemoveRole(userPrincipal: string, role: string) {
    let ProfileMutation: ProfileMutation = {
      userPrincipal: userPrincipal,
      role: role,
    };
    toast.promise(removeRole(ProfileMutation), {
      pending: "Removing Role...",
      success: "Role Removed.",
      error: {
        render(data: any) {
          return `Failed to remove role. ${data.data.response.data.error}`;
        },
      },
    });
  }

  function handleAddRole(userPrincipal: string, role: string) {
    let ProfileMutation: ProfileMutation = {
      userPrincipal: userPrincipal,
      role: role,
    };
    toast.promise(addRole(ProfileMutation), {
      pending: "Adding Role...",
      success: "Role Added.",
      error: {
        render(data: any) {
          return `Failed to add role. ${data.data.response.data.error}`;
        },
      },
    });
  }

  return (
    <Container>
      <ProfileDisplay profile={profile} />
      <div className="flex flex-wrap justify-end gap-2">
        {profile.roles.map((role) => (
          <div
            key={role}
            className={cn(
              "-py-1 flex items-center justify-between gap-4 rounded-sm px-4",
              getUIStateColors({ hover: true, selected: true }),
            )}
          >
            <div>{role}</div>
            <Button
              variant="secondary-icon"
              onClick={() => handleRemoveRole(profile.userPrincipal, role)}
            >
              ❌
            </Button>
          </div>
        ))}
        <div className={`${!addRoleFlag && "hidden"} `}>
          <select
            className={cn(
              "h-full appearance-none rounded-sm px-3",
              getUIStateColors({
                hover: true,
                selected: true,
              }),
            )}
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="contributor">Contributor</option>
          </select>
        </div>
        <Button
          variant="primary-icon"
          hidden={!addRoleFlag}
          onClick={() => {
            handleAddRole(profile.userPrincipal, selectedRole);
            setAddRoleFlag(false);
          }}
        >
          ✔️
        </Button>
        <Button
          variant={addRoleFlag ? "danger-icon" : "primary-icon"}
          onClick={() => setAddRoleFlag(!addRoleFlag)}
        >
          {addRoleFlag ? "❌" : "➕"}
        </Button>
      </div>
    </Container>
  );
}

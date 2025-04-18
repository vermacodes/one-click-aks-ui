import { Lab } from "../../../../dataStructures";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";

type Props = {
  lab: Lab;
  setLab: (lab: Lab) => void;
};

export default function SaveLabRbacEnforcedProtectedLab({
  lab,
  setLab,
}: Props) {
  const { data: profile } = useGetMyProfile();

  if (profile === undefined) {
    return null;
  }

  if (lab.type !== "readinesslab" && lab.type !== "mockcase") {
    return null;
  }

  return (
    <Container
      collapsible
      title="Enforce RBAC on Protected Lab"
      additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
    >
      <div className="flex flex-col">
        <span className="mb-2 text-sm italic text-slate-700 dark:text-slate-300">
          By default, all mentors are able to view and edit Readiness Labs and
          Mock cases. You can however choose to enable Role-Based Access Control
          (RBAC) for this lab. Mentors will see the lab but won't be able to
          read the description or access documents or scripts. To give mentors
          full access, they need to be assigned the "Mentor" role and granted
          lab access.
        </span>
        <Checkbox
          checked={lab.rbacEnforcedProtectedLab}
          disabled={
            !(
              profile.roles.includes("admin") ||
              profile.roles.includes("mentor")
            )
          }
          tooltipMessage={
            !(
              profile.roles.includes("admin") ||
              profile.roles.includes("mentor")
            )
              ? "You must be an admin or mentor to create a mock case."
              : "Use this to save the lab as a mock case."
          }
          id="rbacEnforcedProtectedLab"
          key={"rbacEnforcedProtectedLab"}
          label="Enforce RBAC on Protected Lab"
          handleOnChange={() =>
            setLab({
              ...lab,
              rbacEnforcedProtectedLab: !lab.rbacEnforcedProtectedLab,
            })
          }
        />
      </div>
    </Container>
  );
}

import { Link } from "react-router-dom";
import { defaultLinkTextStyle } from "../../../defaults";
import SelectedWorkspaceResources from "../../Terraform/SelectedWorkspaceResources";
import Workspaces from "../../Terraform/Workspaces";
import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";

type WorkspaceProps = {};

export default function TerraformWorkspaces({}: WorkspaceProps) {
  return (
    <Container title="Terraform Workspace" collapsible={true}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full justify-between gap-x-4">
            <Workspaces />
          </div>
          <div className="flex justify-end">
            <SelectedWorkspaceResources />
          </div>
        </div>
        <Footnote>
          <p>
            1. If you see no workspaces listed. Thats probably because terraform
            is not yet initialized. This will populate once terraform is
            initialized.
          </p>
          <p>
            2. Terraform workspaces are managed by{" "}
            <Link to={"/deployments"} className={defaultLinkTextStyle}>
              deployments
            </Link>
            .
          </p>
        </Footnote>
      </div>
    </Container>
  );
}

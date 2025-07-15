import { DeploymentType } from "../../../dataStructures";
import { defaultUIPrimaryTextColor } from "../../../defaults";
import { cn } from "../../../utils/cn";
import { useWebSocketContext } from "../../Context/WebSocketContext";
import DestroyButton from "../../Terraform/ActionButtons/DestroyButton";
import SelectedWorkspaceResources from "../../Terraform/SelectedWorkspaceResources";
import Container from "../../UserInterfaceComponents/Container";
import AutoDestroySwitch from "../AutoDestroySwitch";
import BreakBlobLease from "../BreakBlobLease";
import DeploymentLifespan from "../DeploymentLifespan";
import DeploymentStatus from "../DeploymentStatus";
import DestroyTime from "../DestroyTime";
import SelectDeployment from "../SelectDeployment";

type Props = {
  deployment: DeploymentType;
  selectedDeployment?: DeploymentType;
};

export default function Deployment({ deployment, selectedDeployment }: Props) {
  const { actionStatus } = useWebSocketContext();

  return (
    <Container>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={cn("text-xl", defaultUIPrimaryTextColor)}>
            {deployment.deploymentWorkspace}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <DeploymentStatus deployment={deployment} />
          <AutoDestroySwitch
            deployment={deployment}
            disabled={actionStatus.inProgress}
            label="Auto Destroy"
            key={deployment.deploymentId}
          />
          <DeploymentLifespan deployment={deployment} />
          <DestroyTime deployment={deployment} />
          <SelectDeployment deployment={deployment} variant="primary-text" />
          <BreakBlobLease
            deployment={deployment}
            buttonVariant="secondary-text"
          />
          <DestroyButton
            variant="danger-text"
            lab={deployment.deploymentLab}
            disabled={
              selectedDeployment === undefined ||
              deployment.deploymentWorkspace !==
                selectedDeployment.deploymentWorkspace
            }
          >
            Destroy
          </DestroyButton>

          <DestroyButton
            variant="danger-text"
            lab={deployment.deploymentLab}
            deleteWorkspace={true}
            deployment={deployment}
            disabled={
              selectedDeployment === undefined ||
              deployment.deploymentWorkspace !==
                selectedDeployment.deploymentWorkspace ||
              selectedDeployment.deploymentWorkspace === "default"
            }
          >
            Delete
          </DestroyButton>
        </div>
      </div>
      {deployment.deploymentWorkspace ===
      selectedDeployment?.deploymentWorkspace ? (
        <div className="mt-8 flex flex-col gap-2">
          Resources
          <SelectedWorkspaceResources />
        </div>
      ) : null}
    </Container>
  );
}

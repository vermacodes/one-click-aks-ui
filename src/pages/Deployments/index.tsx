import { useEffect } from "react";
import { FaPlus, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateNewDeployment from "../../components/Deployments/CreateNewDeployment";
import Deployment from "../../components/Deployments/Deployment";
import Terminal from "../../components/Terminal/Terminal";
import BackButton from "../../components/UserInterfaceComponents/BackButton";
import Button from "../../components/UserInterfaceComponents/Button";
import { DeploymentType } from "../../dataStructures";
import { useGetMyDeployments } from "../../hooks/useDeployments";
import { useSelectedDeployment } from "../../hooks/useSelectedDeployment";
import { useServerStatus } from "../../hooks/useServerStatus";
import { useTerraformWorkspace } from "../../hooks/useWorkspace";
import PageLayout from "../../layouts/PageLayout";
import ServerError from "../ServerError";

export default function Deployments() {
  const { data: deployments } = useGetMyDeployments();
  const { data: workspaces } = useTerraformWorkspace();
  const { data: serverStatus } = useServerStatus();
  const { selectedDeployment } = useSelectedDeployment();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ACT Labs | Deployments";
  }, []);

  if (serverStatus?.status !== "OK") {
    return <ServerError />;
  }

  if (deployments === undefined || workspaces === undefined) {
    return (
      <PageLayout heading="Deployments">
        <p className="text-4xl">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout heading="Deployments">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <BackButton />

        <div
          className={`mb-3 flex flex-col justify-end gap-x-2 rounded-sm sm:flex-row`}
        >
          <Button
            variant="secondary-text"
            onClick={() => {
              if (workspaces.length > 0) {
                navigate("/builder");
              }
            }}
          >
            <FaTools /> Lab Builder
          </Button>
          <CreateNewDeployment variant="primary-text">
            <FaPlus /> Add Deployment
          </CreateNewDeployment>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {deployments &&
          deployments.length > 0 &&
          deployments.map((deployment: DeploymentType) => (
            <Deployment
              deployment={deployment}
              selectedDeployment={selectedDeployment}
              key={deployment.deploymentId}
            />
          ))}
      </div>
      <Terminal />
    </PageLayout>
  );
}

import { FaCheckCircle, FaRocket, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer } from "../../../../dataStructures";
import { useDeployManagedServer } from "../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../hooks/useManagedServer";
import { useAuth } from "../../../Context/AuthContext";
import Button from "../../../UserInterfaceComponents/Button";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../UserInterfaceComponents/GradientBorderContainer";
import Tooltip from "../../../UserInterfaceComponents/Tooltip";
import InactiveDuration from "../InactiveDuration";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {};

export default function ManagedServerComponent({}: Props) {
  const { graphResponse } = useAuth();

  const { data: managedServer, isLoading, isFetching, isError } = useManagedServer();

  const { lock, handleDeploy, handleDestroy, handleUpdate } = useDeployManagedServer();

  function onDeployClick() {
    if (graphResponse === undefined) {
      toast.error("Failed to deploy managed server. User not authenticated.");
      return;
    }
    handleDeploy({
      userPrincipalName: graphResponse?.userPrincipalName,
      userPrincipalId: graphResponse?.id,
      logLevel: "-4",
    } as ManagedServer);
  }

  if (managedServer && managedServer.status === "Unregistered") {
    return <ManagedServerRegistration />;
  }

  return (
    <GradientBorderContainer>
      <Container title="Managed Server (Preview)" collapsible={true} hoverEffect={false}>
        <div className="flex w-full flex-col flex-wrap gap-2">
          {graphResponse && managedServer && (
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip message="Your server's endpoint. Its accessible on https" delay={500}>
                <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                  <span>{managedServer.endpoint}</span>
                </div>
              </Tooltip>
              <Tooltip message="Server Status" delay={500}>
                <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                  <div className="flex items-center gap-2">
                    {managedServer.status === "Running" && <FaCheckCircle className="text-green-600" />}
                    {managedServer.status}
                  </div>
                </div>
              </Tooltip>
              <Tooltip message="Azure Region" delay={500}>
                <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                  <span>{managedServer.region}</span>
                </div>
              </Tooltip>
              <Checkbox
                key={"autoDeploy"}
                tooltipDelay={500}
                tooltipMessage="Server will be deployed again when you become active if it was automatically destroyed due to inactivity."
                label="Auto Deploy"
                id="autoDeploy"
                checked={managedServer.autoCreate}
                handleOnChange={() => handleUpdate({ ...managedServer, autoCreate: !managedServer.autoCreate })}
                disabled={isLoading || isFetching || isError || lock}
              />
              <Checkbox
                key={"autoDestroy"}
                tooltipDelay={500}
                tooltipMessage="Server will be will be automatically destroyed if no activity for an hour."
                label="Auto Destroy"
                id="autoDestroy"
                checked={managedServer.autoDestroy}
                handleOnChange={() => handleUpdate({ ...managedServer, autoDestroy: !managedServer.autoDestroy })}
                disabled={isLoading || isFetching || isError || lock}
              />
              <InactiveDuration managedServer={managedServer} />
            </div>
          )}
          <div className="mt-8 flex gap-4">
            <Button variant="primary" onClick={onDeployClick}>
              <FaRocket /> Deploy
            </Button>
            <Button variant="secondary" onClick={handleDestroy}>
              <FaTrash /> Destroy
            </Button>
            <Button
              variant="danger-outline"
              onClick={handleDestroy}
              disabled
              tooltipMessage="Not available at the moment. Please contact admin."
              tooltipDelay={1000}
            >
              <FaTimes /> Unregister
            </Button>
          </div>
        </div>
      </Container>
    </GradientBorderContainer>
  );
}

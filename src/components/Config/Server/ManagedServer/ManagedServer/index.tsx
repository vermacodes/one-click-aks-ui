import { useEffect } from "react";
import { FaCheckCircle, FaRocket, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer, ServerHosting } from "../../../../../dataStructures";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useAuth } from "../../../../Context/AuthContext";
import Button from "../../../../UserInterfaceComponents/Button";
import Checkbox from "../../../../UserInterfaceComponents/Checkbox";
import Container from "../../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../../UserInterfaceComponents/GradientBorderContainer";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";
import ServerEndpoint from "../../ServerEndpoint";
import InactiveDuration from "../InactiveDuration";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function ManagedServerComponent({ serverHosting, setServerHosting }: Props) {
  const { graphResponse } = useAuth();
  const { data: managedServer, isLoading, isFetching, isError } = useManagedServer();
  const { lock, handleDeploy, handleDestroy, handleUpdate } = useDeployManagedServer();

  useEffect(() => {
    const serverHostingFromLocalStorageString = localStorage.getItem("serverHosting") || "{}";
    const serverHostingFromLocalStorage: ServerHosting = JSON.parse(serverHostingFromLocalStorageString);

    if (serverHostingFromLocalStorage.environment !== "azure" || serverHostingFromLocalStorage.endpoint !== "") {
      return;
    }

    if (managedServer && serverHosting.environment === "azure" && serverHosting.endpoint === "") {
      setServerHosting({
        environment: "azure",
        endpoint: "https://" + managedServer.endpoint + "/",
      });
    }
  }, [managedServer, serverHosting]);

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
      <Container
        title="Managed Server (Preview) 🆕"
        collapsible={true}
        hoverEffect={false}
        additionalClasses="border dark:border-slate-700 border-slate-300"
      >
        <div className="flex w-full flex-col flex-wrap gap-2">
          {graphResponse && managedServer && (
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip message="Your server's endpoint. Its accessible on https" delay={500}>
                <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                  <span>
                    {managedServer.endpoint !== "" ? managedServer.endpoint : "Deploy server to see endpoint here.."}
                  </span>
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
        <ServerEndpoint serverHosting={serverHosting} setServerHosting={setServerHosting} />
        <p className="mt-4 w-full rounded border border-yellow-600 bg-yellow-600 bg-opacity-10 py-1 px-3 text-xs md:w-fit">
          ARO labs only work in Self-Hosted (Docker) environment.
        </p>
      </Container>
    </GradientBorderContainer>
  );
}

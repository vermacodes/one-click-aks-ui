import { useState } from "react";
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
import ConfirmationModal from "../../../../UserInterfaceComponents/Modal/ConfirmationModal";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";
import ServerEndpoint from "../../ServerEndpoint";
import InactiveDuration from "../InactiveDuration";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function ManagedServerComponent({ serverHosting, setServerHosting }: Props) {
  const [confirmUnregister, setConfirmUnregister] = useState<boolean>(false);
  const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);
  const [confirmAutoDestroyDisabled, setConfirmAutoDestroyDisabled] = useState<boolean>(false);

  const { graphResponse } = useAuth();
  const { data: managedServer, isLoading, isFetching, isError } = useManagedServer();
  const { lock, handleDeploy, handleDestroy, handleUpdate, handleUnregister } = useDeployManagedServer();

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

  function onAutoDestroyClick() {
    if (!managedServer) {
      return;
    }

    if (managedServer.autoDestroy) {
      setConfirmAutoDestroyDisabled(true);
      return;
    }

    handleUpdate({ ...managedServer, autoDestroy: true });
  }

  if (managedServer === undefined || (managedServer && managedServer.status === "Unregistered")) {
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
              <Tooltip
                message={
                  `Server Status as seen by Actlabs Hub. ` +
                  `If this shows running and server is still not connecting that can be due to DNS sync delay. ` +
                  `Try opening https://${managedServer.endpoint}/status in a different tab to ensure DNS resolves correctly and ` +
                  `you get a response back. If thee is no response, give it a few minutes and try again.`
                }
                delay={500}
              >
                <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                  <div className="flex items-center gap-2">
                    {managedServer.status === "Running" && <FaCheckCircle className="text-green-600" />}
                    {managedServer.status}
                  </div>
                </div>
              </Tooltip>
              <Tooltip
                message="Azure Region. To change, unregister and select other region when registering again."
                delay={500}
              >
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
                handleOnChange={onAutoDestroyClick}
                disabled={isLoading || isFetching || isError || lock}
              />
              <InactiveDuration managedServer={managedServer} />
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" disabled={lock} onClick={onDeployClick}>
              <FaRocket /> Deploy
            </Button>
            <Button variant="secondary-outline" disabled={lock} onClick={() => setConfirmDestroy(true)}>
              <FaTrash /> Destroy
            </Button>
            <Button
              variant="secondary-outline"
              onClick={() => setConfirmUnregister(true)}
              tooltipMessage="Unregister the managed server."
              tooltipDelay={1000}
              disabled={lock}
            >
              <FaTimes /> Unregister
            </Button>
          </div>
        </div>
        <ServerEndpoint serverHosting={serverHosting} setServerHosting={setServerHosting} />
        <p className="mt-4 w-full rounded border border-yellow-600 bg-yellow-600 bg-opacity-10 py-1 px-3 text-xs md:w-fit">
          ARO labs only work in Self-Hosted (Docker) environment.
        </p>
        {confirmUnregister && (
          <ConfirmationModal
            title="Confirm Unregister"
            onConfirm={() => {
              setConfirmUnregister(false);
              handleUnregister();
            }}
            onClose={() => setConfirmUnregister(false)}
          >
            <p>Are you sure you want to unregister the managed server?</p>
          </ConfirmationModal>
        )}
        {confirmDestroy && (
          <ConfirmationModal
            title="Confirm Destroy Server"
            onConfirm={() => {
              setConfirmDestroy(false);
              handleDestroy();
            }}
            onClose={() => setConfirmDestroy(false)}
          >
            <p className="text-xl">Are you sure you want to destroy the managed server?</p>
            <p className="text-sm">
              Please note that, when manually destroyed, server wont be deployed again automatically and you have to
              manually deploy it.
            </p>
          </ConfirmationModal>
        )}
        {confirmAutoDestroyDisabled && (
          <ConfirmationModal
            title="Confirm Disable Auto Destroy"
            onConfirm={() => {
              setConfirmAutoDestroyDisabled(false);
              handleUpdate({ ...managedServer, autoDestroy: false });
            }}
            onClose={() => setConfirmAutoDestroyDisabled(false)}
          >
            <p className="text-xl">Are you sure you want to disable auto destroy?</p>
            <p className="text-sm">
              Please note that, when auto destroy is disabled, server wont be automatically destroyed and you may incur
              unnecessary cost.
            </p>
          </ConfirmationModal>
        )}
      </Container>
    </GradientBorderContainer>
  );
}

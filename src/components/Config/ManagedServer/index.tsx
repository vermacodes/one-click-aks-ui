import { FaCheckCircle, FaRocket, FaTimes, FaTrash } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ManagedServer } from "../../../dataStructures";
import { useCreateManagedServer, useDestroyManagedServer, useManagedServer } from "../../../hooks/useManagedServer";
import { useResetServerCache } from "../../../hooks/useServerCache";
import { isManagedServer } from "../../../utils/typeguards";
import { useAuth } from "../../Context/AuthContext";
import Button from "../../UserInterfaceComponents/Button";
import Checkbox from "../../UserInterfaceComponents/Checkbox";
import Container from "../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../UserInterfaceComponents/GradientBorderContainer";
import ManagedServerRegistration from "./ManagedServerRegistration";

type Props = {};

export default function ManagedServerComponent({}: Props) {
  const { mutateAsync: resetServerCache } = useResetServerCache();
  const { graphResponse } = useAuth();

  const { data: managedServer } = useManagedServer();
  const { mutateAsync: destroyManagedServer } = useDestroyManagedServer();
  const { mutateAsync: deployManagedServer } = useCreateManagedServer();

  function handleSwitch(baseUrl: string) {
    localStorage.setItem("baseUrl", baseUrl);
    window.location.reload();
    resetServerCache().finally(() => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries();
    });
  }

  function handleDeploy() {
    if (graphResponse === undefined) {
      toast.error("Failed to deploy managed server. User not authenticated.");
      return;
    }

    const response = toast.promise(
      deployManagedServer({
        userPrincipalName: graphResponse.userPrincipalName,
        userPrincipalId: graphResponse.id,
        logLevel: "-4",
      } as ManagedServer),
      {
        pending: "Deploying managed server...",
        success: {
          render(data) {
            console.log(data);
            if (isManagedServer(data?.data?.data)) {
              return `Managed server ${data.data.data.status}.`;
            }
          },
          autoClose: 2000,
        },
        error: {
          render(data: any) {
            return `Failed to deploy managed server. ${data.data.data.error}`;
          },
          autoClose: 5000,
        },
      }
    );

    response.then((data) => {
      if (data.data === undefined) {
        return;
      }
      if (isManagedServer(data.data) && data.data.status === "Running") {
        handleSwitch(`https://${data.data.endpoint}/`);
      }
    });
  }

  function handleDestroy() {
    toast.promise(destroyManagedServer, {
      pending: "Destroying managed server...",
      success: {
        render(data: any) {
          return `Managed server destroyed.`;
        },
        autoClose: 2000,
      },
      error: {
        render(data: any) {
          return `Failed to destroy managed server. ${data.data.data.error}`;
        },
        autoClose: 5000,
      },
    });
  }

  if (managedServer && managedServer.status === "Unregistered") {
    return <ManagedServerRegistration />;
  }

  return (
    <GradientBorderContainer>
      <Container title="Managed Server (Preview)" collapsible={true} hoverEffect={false}>
        <div className="flex w-full flex-col gap-2">
          {graphResponse && managedServer && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                <span className="font-bold">Endpoint</span>
                <span>{managedServer.endpoint}</span>
              </div>
              <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                <span className="font-bold">Status</span>
                <div className="flex items-center gap-2">
                  {managedServer.status === "Running" && <FaCheckCircle className="text-green-600" />}
                  {managedServer.status}
                </div>
              </div>
              <div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
                <span className="font-bold">Region</span>
                <span>{managedServer.region}</span>
              </div>
              <Checkbox
                tooltipDelay={500}
                tooltipMessage="Server will be deployed again when you become active if it was automatically destroyed due to inactivity."
                label="Auto Deploy"
                id="autoDeploy"
                checked={managedServer.autoCreate}
                handleOnChange={() => {}}
                disabled={false}
              />
              <Checkbox
                tooltipDelay={500}
                tooltipMessage="Server will be will be automatically destroyed if no activity for an hour."
                label="Auto Destroy"
                id="autoDestroy"
                checked={false}
                handleOnChange={() => {}}
                disabled={true}
              />
            </div>
          )}
          <div className="mt-8 flex gap-4">
            <Button variant="primary" onClick={handleDeploy}>
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

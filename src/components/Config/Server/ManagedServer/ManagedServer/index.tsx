import { FaRedo, FaStopCircle } from "react-icons/fa";
import { ServerHosting } from "../../../../../dataStructures";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useAuth } from "../../../../Context/AuthContext";
import Container from "../../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../../UserInterfaceComponents/GradientBorderContainer";
import ResetActionStatus from "../../ResetActionStatus";
import ResetServerCache from "../../ResetServerCache";
import ServerEndpoint from "../../ServerEndpoint";
import InactiveDuration from "../InactiveDuration";
import ManagedServerAutoDeployAndDestroy from "../ManagedServerAutoDeployAndDestroy";
import ManagedServerDeployButton from "../ManagedServerDeployButton";
import ManagedServerDestroyButton from "../ManagedServerDestroyButton";
import ManagedServerDomain from "../ManagedServerDomain";
import ManagedServerRegistration from "../ManagedServerRegistration";
import ManagedServerStatus from "../ManagedServerStatus";
import ManagedServerUnregisterButton from "../ManagedServerUnregisterButton";
import ManagedServerVersion from "../ManagedServerVersion";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function ManagedServerComponent({
  serverHosting,
  setServerHosting,
}: Props) {
  const { graphResponse } = useAuth();
  const { data: managedServer } = useManagedServer();

  if (
    managedServer === undefined ||
    (managedServer && managedServer.status === "Unregistered")
  ) {
    return <ManagedServerRegistration />;
  }

  return (
    <GradientBorderContainer>
      <Container
        title="Managed Server (Azure) 🆕"
        collapsible={true}
        hoverEffect={false}
        additionalClasses="border dark:border-slate-700 border-slate-300"
      >
        <div className="flex w-full flex-col gap-2">
          {graphResponse && managedServer && (
            <div className="flex flex-col flex-wrap items-center gap-2 sm:flex-row">
              <ManagedServerDomain />
              <ManagedServerVersion />
              <ManagedServerStatus />
              <ManagedServerAutoDeployAndDestroy />
              <InactiveDuration managedServer={managedServer} />
            </div>
          )}
          <ServerEndpoint
            serverHosting={serverHosting}
            setServerHosting={setServerHosting}
          />
          <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row">
            <ManagedServerDeployButton />
            <ManagedServerDestroyButton />
            <ManagedServerUnregisterButton />
            <ResetServerCache
              variant="danger-text"
              tooltipMessage="Reset server cache. This will clear all the cache on the server. Use this if you are facing issues with the server."
            >
              <FaRedo /> Reset Cache
            </ResetServerCache>
            <ResetActionStatus
              variant="danger-text"
              tooltipMessage="Reset Action Status. This will stop any long running action on server."
            >
              <FaStopCircle /> Stop Running Action
            </ResetActionStatus>
          </div>
        </div>
      </Container>
    </GradientBorderContainer>
  );
}

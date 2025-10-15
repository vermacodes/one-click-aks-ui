import { FaRedo, FaStopCircle } from "react-icons/fa";
import { ServerHosting } from "../../../../../dataStructures";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useAuth } from "../../../../../context/AuthContext";
import Container from "../../../../UserInterfaceComponents/Container";
import ResetActionStatus from "../../ResetActionStatus";
import ResetServerCache from "../../ResetServerCache";
import ServerEndpoint from "../../ServerEndpoint";
import ManagedServerRegistration from "../ManagedServerRegistration";
import ManagedServerUnregisterButton from "../ManagedServerUnregisterButton";

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
    <Container
      collapsible={false}
      hoverEffect={false}
      additionalClasses="border dark:border-slate-700 border-slate-300 mt-16"
    >
      <div className="flex w-full flex-wrap gap-2">
        <ServerEndpoint
          serverHosting={serverHosting}
          setServerHosting={setServerHosting}
        />
        <div className="mt-8 flex flex-wrap gap-4">
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
  );
}

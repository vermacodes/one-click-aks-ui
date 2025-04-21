import { FaRedo, FaStopCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ServerHosting } from "../../../../dataStructures";
import CodeBlock from "../../../UserInterfaceComponents/CodeBlock";
import Container from "../../../UserInterfaceComponents/Container";
import ResetActionStatus from "../ResetActionStatus";
import ResetServerCache from "../ResetServerCache";
import ServerEndpoint from "../ServerEndpoint";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function Docker({ serverHosting, setServerHosting }: Props) {
  return (
    <Container
      title="Self Hosted (Docker)"
      collapsible={true}
      hoverEffect={false}
      additionalClasses="border dark:border-slate-700 border-slate-300"
    >
      <p>
        To self host server on docker, you need WSL (linux) and docker installed
        on your system.
      </p>
      <ol className="my-4 ml-6 list-decimal gap-2">
        <li className="py-1">Open WSL</li>
        <li className="py-1">
          Ensure that you've selected correct default account by running
          following command.
          <CodeBlock codeString="az account show" copyEnabled={true} />
        </li>
        <li className="py-1">
          Run following command to complete configuration and deployment.
          <CodeBlock
            codeString="curl -o actlabs.sh -sLO https://aka.ms/ACTLabStart; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
            copyEnabled={true}
          />
        </li>
        <li className="py-1">
          After the deployment is successful, you will see the status changed to
          "Running".
        </li>
        <li className="py-1">
          If you run into issues{" "}
          <Link
            to={"/feedback"}
            className="text-sky-700 underline dark:text-sky-500"
          >
            let us know
          </Link>
          .
        </li>
      </ol>
      <ServerEndpoint
        serverHosting={serverHosting}
        setServerHosting={setServerHosting}
        editable={true}
      />
      <div className="mt-8 flex flex-wrap gap-4">
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
    </Container>
  );
}

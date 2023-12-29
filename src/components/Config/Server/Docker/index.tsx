import { Link } from "react-router-dom";
import { ServerHosting } from "../../../../dataStructures";
import CodeBlock from "../../../UserInterfaceComponents/CodeBlock";
import Container from "../../../UserInterfaceComponents/Container";
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
      <p>To self host server on docker, you need WSL (linux) and docker installed on your system.</p>
      <ol className="my-4 ml-6 list-decimal gap-2">
        <li className="py-1">Open WSL</li>
        <li className="py-1">
          Ensure that you've selected correct default account by running following command.
          <CodeBlock codeString="az account show" copyEnabled={true} />
        </li>
        <li className="py-1">
          Run following command to complete configuration and deployment.
          <CodeBlock
            codeString="curl -o actlabs.sh -sLO https://aka.ms/ACTLabStart; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
            copyEnabled={true}
          />
        </li>
        <li className="py-1">After the deployment is successful, you will see the status changed to "Running".</li>
        <li className="py-1">
          If you run into issues{" "}
          <Link to={"/feedback"} className="text-sky-500 underline">
            let us know
          </Link>
          .
        </li>
      </ol>
      <ServerEndpoint serverHosting={serverHosting} setServerHosting={setServerHosting} editable={true} />
    </Container>
  );
}

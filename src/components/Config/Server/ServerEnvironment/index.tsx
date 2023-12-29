import { ServerHosting } from "../../../../dataStructures";
import { useManagedServer } from "../../../../hooks/useManagedServer";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function ServerEnvironment({ serverHosting, setServerHosting }: Props) {
  // const [baseUrl, setBaseUrl] = useState<string>("http://localhost:8880/");
  // const { mutateAsync: resetServerCache } = useResetServerCache();

  const { data: managedServer } = useManagedServer();

  // useEffect(() => {
  //   const baseUrlFromLocalStorage = localStorage.getItem("baseUrl");
  //   if (baseUrlFromLocalStorage != undefined && baseUrlFromLocalStorage !== "") {
  //     setBaseUrl(baseUrlFromLocalStorage);
  //   }
  // }, []);

  return (
    <Container
      title="Environment"
      collapsible={true}
      hoverEffect={false}
      additionalClasses="border dark:border-slate-700 border-slate-300"
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap items-center justify-end gap-4">
          <Checkbox
            id="docker"
            checked={serverHosting.environment === "docker"}
            disabled={false}
            handleOnChange={() =>
              setServerHosting({
                environment: "docker",
                endpoint: "http://localhost:8880/",
              })
            }
            label={"Self-Hosted (Docker)"}
            key={"docker-key"}
          />
          <Checkbox
            id="managedServer"
            tooltipMessage="To disable managed server, change the server endpoint to something other than the managed server."
            checked={serverHosting.environment === "azure"}
            disabled={managedServer === undefined}
            handleOnChange={() =>
              setServerHosting({
                environment: "azure",
                endpoint: "https://" + managedServer?.endpoint + "/",
              })
            }
            label={"Managed Server (Azure) 🆕"}
            key={"managed-server-key"}
          />
        </div>
      </div>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../../../../dataStructures";
import {
  defaultLinkTextStyle,
  getDefaultServerHosting,
} from "../../../../defaults";
import { useResetServerCache } from "../../../../hooks/useServerCache";
import Container from "../../../UserInterfaceComponents/Container";
import Docker from "../Docker";
import ManagedServerComponent from "../ManagedServer/ManagedServer";
import ServerEnvironment from "../ServerEnvironment";
import ServerStatus from "../ServerStatus";

type Props = {};

export default function ServerConfig({}: Props) {
  const [serverHosting, setServerHosting] = useState<ServerHosting>(
    getDefaultServerHosting(),
  );
  const { mutateAsync: resetServerCache } = useResetServerCache();

  useEffect(() => {
    const serverHostingFromLocalStorage = localStorage.getItem("serverHosting");
    if (serverHostingFromLocalStorage != null) {
      setServerHosting(JSON.parse(serverHostingFromLocalStorage));
    }
  }, []);

  function handleServerHostingChange(newServerHosting: ServerHosting) {
    if (
      newServerHosting.environment === serverHosting.environment &&
      newServerHosting.endpoint === serverHosting.endpoint
    ) {
      return;
    }

    localStorage.setItem("serverHosting", JSON.stringify(newServerHosting));
    setServerHosting(newServerHosting);
    window.location.reload();
    resetServerCache().finally(() => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries();
    });
  }

  return (
    <Container title="Server">
      <div className="flex flex-col gap-4 pb-4">
        <ServerStatus />
        <ServerEnvironment
          serverHosting={serverHosting}
          setServerHosting={handleServerHostingChange}
        />
        {serverHosting.environment === "docker" && (
          <Docker
            serverHosting={serverHosting}
            setServerHosting={handleServerHostingChange}
          />
        )}
        {serverHosting.environment === "azure" && (
          <ManagedServerComponent
            serverHosting={serverHosting}
            setServerHosting={handleServerHostingChange}
          />
        )}
      </div>
      <p className="mt-4 text-sm">
        ✨ To know more about server hosting{" "}
        <a
          className={defaultLinkTextStyle}
          href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280601/Getting-Started?anchor=option-1%3A-hosting-the-server-on-docker"
          target="_blank"
        >
          read our docs here
        </a>
        .
      </p>
    </Container>
  );
}

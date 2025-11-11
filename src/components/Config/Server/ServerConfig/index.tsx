import { ServerHosting } from "../../../../dataStructures";
import { defaultLinkTextStyle } from "../../../../defaults";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import { useServerHostingSync } from "../../../../hooks/useServerHostingSync";
import Container from "../../../UserInterfaceComponents/Container";
import Footnote from "../../../UserInterfaceComponents/Footnote";
import Docker from "../Docker";
import ManagedServerComponent from "../ManagedServer/ManagedServer";
import ServerEnvironment from "../ServerEnvironment";
import ServerStatus from "../ServerStatus";

type Props = {};

export default function ServerConfig({}: Props) {
  const { serverHosting, updateServerHosting } = useServerHostingSync();
  const { data: profile } = useGetMyProfile();

  function handleServerHostingChange(newServerHosting: ServerHosting) {
    updateServerHosting(newServerHosting);
  }

  return (
    <Container title="Server">
      <div className="flex flex-col gap-4 pb-4">
        <ServerStatus />
        {profile && profile.roles.includes("admin") && (
          <ServerEnvironment
            serverHosting={serverHosting}
            setServerHosting={handleServerHostingChange}
          />
        )}
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
      <Footnote>
        <p>
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
      </Footnote>
    </Container>
  );
}

import { useState } from "react";
import { ServerHosting } from "../../../../dataStructures";
import Container from "../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../UserInterfaceComponents/GradientBorderContainer";
import CustomDeployment from "../CustomDeployment";
import Docker from "../Docker";
import ManagedServerComponent from "../ManagedServer/ManagedServer";
import ServerEnvironment from "../ServerEnvironment";
import ServerStatus from "../ServerStatus";

type Props = {};

export default function ServerConfig({}: Props) {
  const [serverHosting, setServerHosting] = useState<ServerHosting>({
    environment: "docker",
    endpoint: "http://localhost:8880/",
  });
  return (
    <GradientBorderContainer>
      <Container title="Server" hoverEffect={false}>
        <div className="flex flex-col gap-4 pb-4">
          <ServerStatus />
          <ServerEnvironment serverHosting={serverHosting} setServerHosting={setServerHosting} />
          {serverHosting.environment === "custom" && <CustomDeployment serverHosting={serverHosting} setServerHosting={setServerHosting} />}
          {serverHosting.environment === "docker" && <Docker serverHosting={serverHosting} setServerHosting={setServerHosting} />}
          {serverHosting.environment === "azure" && <ManagedServerComponent serverHosting={serverHosting} setServerHosting={setServerHosting} />}
        </div>
      </Container>
    </GradientBorderContainer>
  );
}

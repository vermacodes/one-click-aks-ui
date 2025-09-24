import { SiTerraform } from "react-icons/si";
import { useServerStatus } from "../../../hooks/useServerStatus";
import InitButton from "../../Terraform/ActionButtons/InitButton";
import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";

type Props = {};

export default function TerraformInit({}: Props) {
  const { data: serverStatus } = useServerStatus();

  if (serverStatus?.status !== "OK") {
    return <></>;
  }
  return (
    <Container title="Initialize Terraform" collapsible={true}>
      <div className="flex items-center justify-end py-2">
        <InitButton variant="secondary-text" ariaLabel="Terraform Init">
          <SiTerraform aria-label="Terraform Icon" /> Terraform Init
        </InitButton>
      </div>
      <Footnote>
        <p>
          Terraform is auto initialized after login. But if you see issues, use
          this to initialize again.
        </p>
      </Footnote>
    </Container>
  );
}

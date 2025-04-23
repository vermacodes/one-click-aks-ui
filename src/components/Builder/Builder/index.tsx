import { useState } from "react";
import { Lab } from "../../../dataStructures";
import { useLab } from "../../../hooks/useLab";
import ExportLabInBuilder from "../../Lab/Export/ExportLabInBuilder";
import ImportLabToBuilder from "../../Lab/Import/ImportLabToBuilder";
import ResetLabState from "../../Lab/ResetLabState";
import SaveLabButton from "../../Lab/SaveLab/SaveLabButton";
import ApplyButton from "../../Terraform/ActionButtons/ApplyButton";
import DestroyButton from "../../Terraform/ActionButtons/DestroyButton";
import PlanButton from "../../Terraform/ActionButtons/PlanButton";
import Container from "../../UserInterfaceComponents/Container";
import AzureFirewall from "../AzureFirewall";
import ContainerRegistry from "../ContainerRegistry";
import ExtensionScript from "../ExtensionScript";
import AddKubernetesCluster from "../KubernetesCluster/AddKubernetesCluster";
import KubernetesCluster from "../KubernetesCluster/KubernetesCluster";
import ResourceGroup from "../ResourceGroup";
import VirtualMachine from "../VirtualMachine";
import VirtualNetwork from "../VirtualNetwork";

export default function Builder() {
  const { data: lab } = useLab();

  const [_lab, _setLab] = useState<Lab | undefined>(lab);

  return (
    <Container
      title="Builder"
      additionalClasses="flex flex-col gap-4"
      collapsible={true}
    >
      <div className="flex flex-wrap gap-4">
        <ResourceGroup />
        <VirtualNetwork />
        <ContainerRegistry />
        <AzureFirewall />
        <AddKubernetesCluster />
        <KubernetesCluster />
        <VirtualMachine />
        <ExtensionScript />
      </div>
      <div className={`mt-12 flex flex-wrap gap-2`}>
        <PlanButton variant="success-text" lab={lab}>
          Plan
        </PlanButton>
        <ApplyButton variant="primary-text" lab={lab}>
          Deploy
        </ApplyButton>
        <DestroyButton variant="danger-text" lab={lab}>
          Destroy
        </DestroyButton>
        <SaveLabButton />
        <ResetLabState buttonVariant="secondary-text" />
        <ExportLabInBuilder variant="secondary-text">
          Download
        </ExportLabInBuilder>
        <ImportLabToBuilder />
      </div>
    </Container>
  );
}

import { useContext } from "react";
import { useSetLogs } from "../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../Context/WebSocketContext";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";

type Props = { index: number };

export default function WorkloadIdentity({ index }: Props) {
  const { actionStatus } = useContext(WebSocketContext);
  const { mutate: setLogs } = useSetLogs();
  const { lab, setLab } = useGlobalStateContext();

  const newLab = structuredClone(lab); //shallow copy of lab
  const cluster = newLab?.template?.kubernetesClusters[index];

  // Handle checkbox change
  const handleOnChange = () => {
    const newLab = structuredClone(lab);
    const cluster = newLab?.template?.kubernetesClusters[index];

    if (cluster?.workloadIdentityEnabled !== undefined && newLab !== undefined) {
      // we have to set workloadIdentityEnabled and oidcIssuerEnabled
      // to the same value
      cluster.workloadIdentityEnabled = !cluster.workloadIdentityEnabled;
      cluster.oidcIssuerEnabled = cluster.workloadIdentityEnabled;
      !actionStatus.inProgress &&
        setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
      setLab(newLab);
    }
  };

  // Determine checked and disabled states
  const checked = cluster?.workloadIdentityEnabled ?? false;
  const disabled = !cluster;

  return lab?.template ? (
    <Checkbox
      id="toggle-workload-identity"
      label="Workload Identity"
      checked={checked}
      disabled={disabled}
      handleOnChange={handleOnChange}
    />
  ) : null;
}

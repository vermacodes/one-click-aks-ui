import { useContext } from "react";
import { useSetLogs } from "../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../context/GlobalStateContext";
import { WebSocketContext } from "../../../../../context/WebSocketContext";
import Checkbox from "../../../../UserInterfaceComponents/Checkbox";

type Props = { index: number };

export default function MicrosoftDefender({ index }: Props) {
  const { actionStatus } = useContext(WebSocketContext);
  const { mutate: setLogs } = useSetLogs();
  const { lab, setLab } = useGlobalStateContext();

  const newLab = structuredClone(lab); //shallow copy of lab
  const cluster = newLab?.template?.kubernetesClusters[index];

  // Handle checkbox change
  const handleOnChange = () => {
    if (cluster?.addons && newLab !== undefined) {
      cluster.addons.microsoftDefender = !cluster.addons.microsoftDefender;
      !actionStatus.inProgress &&
        setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
      setLab(newLab);
    }
  };

  // Determine checked and disabled states
  const checked = cluster?.addons?.microsoftDefender ?? false;
  const disabled = !cluster;

  return lab?.template ? (
    <Checkbox
      id="toggle-defender"
      label="Microsoft Defender"
      checked={checked}
      disabled={disabled}
      handleOnChange={handleOnChange}
    />
  ) : null;
}

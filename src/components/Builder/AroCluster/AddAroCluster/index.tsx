import { useContext, useEffect, useState } from "react";
import { TfvarAroClusterType } from "../../../../dataStructures";
import { getDefaultAroCluster } from "../../../../defaults";
import { useGetDefaultAROVersion } from "../../../../hooks/useAroVersions";
import { useSetLogs } from "../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../context/GlobalStateContext";
import { WebSocketContext } from "../../../../context/WebSocketContext";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";

export default function AddAroCluster() {
  const [tooltipMessage, setTooltipMessage] = useState<string>("");
  const { lab, setLab } = useGlobalStateContext();
  const { actionStatus } = useContext(WebSocketContext);
  const { mutate: setLogs } = useSetLogs();

  const { data: defaultVersion } = useGetDefaultAROVersion();

  const noVirtualNetworksMessage = "Virtual Network Required.";

  const disabled = (lab.template?.virtualNetworks.length ?? 0) === 0;
  const checked = (lab?.template?.aroClusters?.length ?? 0) > 0;

  useEffect(() => {
    if (disabled && tooltipMessage !== noVirtualNetworksMessage) {
      setTooltipMessage(noVirtualNetworksMessage);
    } else if (!disabled && tooltipMessage) {
      setTooltipMessage("");
    }
  }, [disabled, tooltipMessage, noVirtualNetworksMessage]);

  // The default value that kubernetes cluster will carry.
  function defaultValue(): TfvarAroClusterType {
    const deepCopy = getDefaultAroCluster();
    return {
      ...deepCopy,
      version: defaultVersion || "",
    };
  }

  function handleOnChange() {
    const newLab = structuredClone(lab);
    if (newLab?.template) {
      newLab.template.aroClusters =
        newLab.template.aroClusters?.length === 0 ? [defaultValue()] : [];
      !actionStatus.inProgress &&
        setLogs({ logs: JSON.stringify(newLab.template, null, 4) });
      setLab(newLab);
    }
  }

  return (
    <Checkbox
      id="toggle-aks"
      label="ARO Cluster"
      checked={checked || false}
      disabled={disabled}
      tooltipMessage={tooltipMessage}
      tooltipDelay={200}
      handleOnChange={handleOnChange}
    />
  );
}

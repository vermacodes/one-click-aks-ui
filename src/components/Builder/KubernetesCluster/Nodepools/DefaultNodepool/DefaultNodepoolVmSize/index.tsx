import { useContext, useEffect, useState } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../../../Context/WebSocketContext";
import Input from "../../../../../UserInterfaceComponents/Input";

type Props = {
  index: number;
};

export default function DefaultNodepoolVmSize({ index }: Props) {
  const [vmSize, setVmSize] = useState<string>("Standard_D2_v5");

  const { lab, setLab } = useGlobalStateContext();
  const { actionStatus } = useContext(WebSocketContext);
  const { mutate: setLogs } = useSetLogs();

  useEffect(() => {
    if (!lab?.template?.kubernetesClusters[index]?.defaultNodePool?.vmSize) {
      handleOnChange(vmSize);
      return;
    }

    if (lab.template.kubernetesClusters[index].defaultNodePool.vmSize === "") {
      handleOnChange(vmSize);
      return;
    }

    if (
      lab.template.kubernetesClusters[index].defaultNodePool.vmSize !== vmSize
    ) {
      setVmSize(lab.template.kubernetesClusters[index].defaultNodePool.vmSize);
    }
  }, [lab, vmSize]);

  const handleOnChange = (value: string) => {
    const newLab = structuredClone(lab);
    const cluster = newLab?.template?.kubernetesClusters[index];

    if (!cluster?.defaultNodePool) {
      return;
    }

    cluster.defaultNodePool.vmSize = value;

    if (!actionStatus.inProgress) {
      setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
    }

    setLab(newLab);
  };

  const disabled =
    !lab?.template?.kubernetesClusters[index]?.defaultNodePool?.vmSize;

  return (
    <div className="flex flex-col items-center gap-2 whitespace-nowrap sm:flex-row">
      <label htmlFor="vmSize">VM Size</label>
      <Input
        id="vmSize"
        disabled={disabled}
        value={vmSize}
        type="text"
        onChange={(e) => handleOnChange(e.target.value)}
      />
    </div>
  );
}

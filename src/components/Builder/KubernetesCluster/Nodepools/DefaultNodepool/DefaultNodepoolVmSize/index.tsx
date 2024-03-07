import { useContext, useState, useEffect } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { WebSocketContext } from "../../../../../Context/WebSocketContext";

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
      // if the vmSize is not set, set it to the default value
      handleOnChange(vmSize);
      return;
    }

    if (lab.template.kubernetesClusters[index].defaultNodePool.vmSize !== vmSize) {
      setVmSize(lab.template.kubernetesClusters[index].defaultNodePool.vmSize);
    }

  }, [lab]);

  const handleOnChange = (value: string) => {
    const newLab = structuredClone(lab);
    const cluster = newLab?.template?.kubernetesClusters[index];

    if (!cluster?.defaultNodePool?.enableAutoScaling) {
      return;
    }

    cluster.defaultNodePool.vmSize = value;

    if (!actionStatus.inProgress) {
      setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
    }

    setLab(newLab);
  };

  const disabled = !lab?.template?.kubernetesClusters[index]?.defaultNodePool?.vmSize;

  return (
    <div className="flex gap-2">
      <label htmlFor="vmSize">VM Size</label>
      <input
        className="rounded bg-inherit px-2 ring-1 ring-slate-500 focus:ring-2 focus:outline-none focus:ring-sky-500"
        id="vmSize"
        disabled={disabled}
        placeholder={vmSize}
        value={vmSize}
        type="text"
        onChange={(e) => handleOnChange(e.target.value)}
      />
    </div>
  );
}

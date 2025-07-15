import { getUIStateColors } from "../../../../../../defaults";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { useWebSocketContext } from "../../../../../Context/WebSocketContext";
import DropdownSelect from "../../../../../UserInterfaceComponents/DropdownSelect";

type Props = {
  index: number;
};

export default function DefaultNodeOSSKU({ index }: Props) {
  const { lab, setLab } = useGlobalStateContext();
  const { actionStatus } = useWebSocketContext();
  const { mutate: setLogs } = useSetLogs();

  const nodeOSes = ["Ubuntu", "AzureLinux"];
  const currentNodeOSSKU =
    lab?.template?.kubernetesClusters[index].defaultNodePool.osSku;

  function handleOnNodeOSChange(nodeOS: string) {
    // clone the lab object so we don't mutate the state directly,
    // then set the new node OS SKU and update the lab state
    const newLab = structuredClone(lab);
    const cluster = newLab?.template?.kubernetesClusters[index];

    if (!cluster?.defaultNodePool) {
      return;
    }

    if (cluster.defaultNodePool.osSku === nodeOS) {
      return;
    }

    cluster.defaultNodePool.osSku = nodeOS;

    if (!actionStatus.inProgress) {
      setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
    }

    setLab(newLab);
  }

  const renderItem = (osSku: string) => {
    const isActive = osSku === currentNodeOSSKU;

    const baseClasses =
      "relative w-full cursor-pointer items-center justify-between rounded-sm p-2 mt-2";
    const activeClasses = getUIStateColors({
      selected: true,
      hover: true,
      colors: "success",
    });
    const hoverClasses = getUIStateColors({
      hover: true,
    });

    const containerClasses = isActive
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;

    return <div className={containerClasses}>{osSku}</div>;
  };

  /**
   * Function to render an item
   *
   * @param {NodeOSSKUs} nodeOSSKU - string array containing OS SKU values
   * @returns JSX.Element - The rendered item
   */
  return (
    <div className="-m-2 flex w-64 flex-wrap items-center gap-2 whitespace-nowrap sm:flex-nowrap">
      <label htmlFor="nodeOSSKU">Node OS SKU</label>
      <DropdownSelect
        heading={currentNodeOSSKU == null ? "Ubuntu" : currentNodeOSSKU}
        items={nodeOSes}
        onItemClick={handleOnNodeOSChange}
        renderItem={renderItem}
        tooltipMessage="The operating system to use for the default node pool."
        tooltipDelay={1000}
      />
    </div>
  );
}

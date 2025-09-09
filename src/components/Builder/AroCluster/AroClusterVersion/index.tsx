import { getUIStateColors } from "../../../../defaults";
import { useGetAROVersions } from "../../../../hooks/useAroVersions";
import { useSetLogs } from "../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../Context/GlobalStateContext";
import { useWebSocketContext } from "../../../Context/WebSocketContext";
import DropdownSelect from "../../../UserInterfaceComponents/DropdownSelect";

type Props = {
  index: number;
};

export default function AroClusterVersion({ index }: Props) {
  const { data: aroVersions, isLoading, isFetching } = useGetAROVersions();

  const { lab, setLab } = useGlobalStateContext();
  const { actionStatus } = useWebSocketContext();
  const { mutate: setLogs } = useSetLogs();

  // Determine if the version menu should be disabled
  const disabled = isLoading || isFetching;

  // Determine the current version
  const currentVersion = lab?.template?.aroClusters[index]?.version;

  /**
   * Handles the selection of version.
   *
   * @param {version} string - The selected version.
   */
  const handleOnSelect = (version: string) => {
    const newLab = structuredClone(lab);
    if (newLab?.template && newLab.template.aroClusters[index]) {
      newLab.template.aroClusters[index].version = version;
      !actionStatus.inProgress &&
        setLogs({ logs: JSON.stringify(newLab.template, null, 4) });
      setLab(newLab);
    }
  };

  /**
   * Function to render an item.
   *
   * @param {version} string - The version to render.
   * @returns JSX.Element - The rendered item.
   */
  const renderItem = (version: string) => {
    const isActive = version === currentVersion;

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

    return <div className={containerClasses}>{version}</div>;
  };

  if (!aroVersions || aroVersions.value.length === 0) {
    return <div>No ARO versions available</div>;
  }

  return (
    <div className="w-64">
      <DropdownSelect
        disabled={disabled}
        heading={isLoading || isFetching ? "Please wait..." : currentVersion}
        items={aroVersions.value.map((value) => value.properties.version)}
        onItemClick={handleOnSelect}
        renderItem={renderItem}
        width={"full"}
        height={"h-60"}
      />
    </div>
  );
}

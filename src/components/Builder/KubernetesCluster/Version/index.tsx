import { PatchVersions } from "../../../../dataStructures";
import { getUIStateColors } from "../../../../defaults";
import { useKubernetesVersions } from "../../../../hooks/useKubernetesVersions";
import { useSetLogs } from "../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../Context/GlobalStateContext";
import { useWebSocketContext } from "../../../Context/WebSocketContext";
import DropdownSelect from "../../../UserInterfaceComponents/DropdownSelect";

type Props = {
  index: number;
};

export default function Version({ index }: Props) {
  const { patchVersions, isLoading, isFetching } = useKubernetesVersions();

  const { lab, setLab } = useGlobalStateContext();
  const { actionStatus } = useWebSocketContext();
  const { mutate: setLogs } = useSetLogs();

  // Determine if the version menu should be disabled
  const disabled = isLoading || isFetching;

  // Determine the current version
  const currentVersion =
    lab?.template?.kubernetesClusters[index]?.kubernetesVersion;

  /**
   * Handles the selection of a patch version.
   *
   * @param {PatchVersions} patchVersion - The selected patch version.
   */
  const handleOnSelect = (patchVersion: PatchVersions) => {
    const patchVersionKey = Object.keys(patchVersion)[0];
    const newLab = structuredClone(lab);
    if (newLab?.template && newLab.template.kubernetesClusters[index]) {
      newLab.template.kubernetesClusters[index].kubernetesVersion =
        patchVersionKey;
      !actionStatus.inProgress &&
        setLogs({ logs: JSON.stringify(newLab.template, null, 4) });
      setLab(newLab);
    }
  };

  /**
   * Function to render an item.
   *
   * @param {PatchVersions} patchVersion - The patch version to render.
   * @returns JSX.Element - The rendered item.
   */
  const renderItem = (patchVersion: PatchVersions) => {
    const key = Object.keys(patchVersion)[0];

    // Determine the classes to apply based on whether the current version matches the key
    const isActive = key === currentVersion;
    const baseClasses =
      "w-full cursor-pointer items-center justify-between rounded-sm p-2 mt-2";
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

    const upgradesClasses = isActive
      ? "space-x-2 text-xs"
      : "space-x-2 text-xs";

    return (
      <div className={containerClasses}>
        <div className="flex justify-between">
          <div key={key}>{key}</div>
        </div>
        <div className={upgradesClasses}>
          Upgrades:
          {patchVersion[key].upgrades?.map((upgrade) => (
            <span key={upgrade}>{upgrade}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64">
      <DropdownSelect
        disabled={disabled}
        heading={isLoading || isFetching ? "Please wait..." : currentVersion}
        items={patchVersions}
        onItemClick={handleOnSelect}
        renderItem={renderItem}
        width={"full"}
        height={"h-60"}
      />
    </div>
  );
}

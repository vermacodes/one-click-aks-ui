import { ManagedServer } from "../../../../../dataStructures";
import { getUIStateColors } from "../../../../../defaults";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import DropdownSelect from "../../../../UserInterfaceComponents/DropdownSelect";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerInactiveLife({ managedServer }: Props) {
  // array allowed lifespans in seconds.
  const lifespans = [900, 1800, 3600, 7200];

  const { handleUpdate } = useDeployManagedServer();

  function secondsToHoursOrMinutes(seconds: number) {
    if (seconds < 3600) {
      return seconds / 60 === 1
        ? "1 Minute"
        : Math.floor(seconds / 60) + " Minutes";
    } else if (seconds < 86400) {
      return seconds / 3600 === 1
        ? "1 Hour"
        : Math.floor(seconds / 3600) + " Hours";
    } else {
      return seconds / 86400 === 1
        ? "1 Day"
        : Math.floor(seconds / 86400) + " Days";
    }
  }

  function handleManagedServerInactiveDurationChange(lifespan: number) {
    handleUpdate({ ...managedServer, inactivityDurationInSeconds: lifespan });
  }

  const renderItem = (lifespan: number) => {
    const isActive = lifespan === managedServer.inactivityDurationInSeconds;

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

    return (
      <div className={containerClasses}>
        {secondsToHoursOrMinutes(lifespan)}
      </div>
    );
  };

  return (
    <div className="w-36 min-w-fit">
      <DropdownSelect
        heading={
          managedServer.autoDestroy
            ? secondsToHoursOrMinutes(managedServer.inactivityDurationInSeconds)
            : "Never"
        }
        items={lifespans}
        onItemClick={handleManagedServerInactiveDurationChange}
        renderItem={renderItem}
        tooltipMessage={
          managedServer.autoDestroy
            ? "The managed server will be automatically deleted if there is no user activity for set duration."
            : "Enable auto destroy to set inactivity duration."
        }
        tooltipDelay={500}
        disabled={!managedServer.autoDestroy}
      />
    </div>
  );
}

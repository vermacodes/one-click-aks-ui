import { ManagedServer } from "../../../../dataStructures";
import { useDeployManagedServer } from "../../../../hooks/useDeployManagedServer";
import DropdownSelect from "../../../UserInterfaceComponents/DropdownSelect";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerInactiveLife({ managedServer }: Props) {
  // array allowed lifespans in seconds.
  const lifespans = [900, 1800, 3600, 7200, 14400, 28800];

  const { handleUpdate } = useDeployManagedServer();

  function secondsToHoursOrMinutes(seconds: number) {
    if (seconds < 3600) {
      return seconds / 60 === 1 ? "1 Minute" : Math.floor(seconds / 60) + " Minutes";
    } else if (seconds < 86400) {
      return seconds / 3600 === 1 ? "1 Hour" : Math.floor(seconds / 3600) + " Hours";
    } else {
      return seconds / 86400 === 1 ? "1 Day" : Math.floor(seconds / 86400) + " Days";
    }
  }

  function handleManagedServerInactiveDurationChange(lifespan: number) {
    handleUpdate({ ...managedServer, inactivityDurationInSeconds: lifespan });
  }

  const renderItem = (lifespan: number) => {
    return (
      <div
        className={`${
          lifespan === managedServer.inactivityDurationInSeconds && "bg-green-300 hover:text-slate-900 dark:text-slate-900"
        } w-full cursor-pointer items-center justify-between rounded p-2 hover:bg-sky-500 hover:text-slate-100`}
      >
        {secondsToHoursOrMinutes(lifespan)}
      </div>
    );
  };

  return (
    <div className="w-32 min-w-fit">
      <DropdownSelect
        heading={secondsToHoursOrMinutes(managedServer.inactivityDurationInSeconds)}
        items={lifespans}
        onItemClick={handleManagedServerInactiveDurationChange}
        renderItem={renderItem}
        tooltipMessage="The managed server will be automatically deleted if there is no user activity for set duration."
        tooltipDelay={1000}
      />
    </div>
  );
}

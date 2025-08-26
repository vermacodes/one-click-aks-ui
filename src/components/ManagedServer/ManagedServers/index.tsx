import { useState } from "react";
import { useAdminGetAllManagedServers } from "../../../hooks/useManagedServer";
import FilterTextBox from "../../UserInterfaceComponents/FilterTextBox";
import ManagedServerCard from "../ManagedServerCard";

type Props = {};

export default function ManagedServers({}: Props) {
  const { data: managedServers } = useAdminGetAllManagedServers();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredManagedServers = managedServers
    ?.filter((managedServer) => {
      return Object.values(managedServer).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
    })
    .sort((a, b) => {
      const aRunning = a.status === "Running";
      const bRunning = b.status === "Running";
      const aTime = new Date(a.lastActivityTime).getTime();
      const bTime = new Date(b.lastActivityTime).getTime();
      if (aRunning && bRunning) {
        // Both running: sort by lastActivityTime desc
        return bTime - aTime;
      }
      if (aRunning && !bRunning) return -1;
      if (!aRunning && bRunning) return 1;
      // Both not running: sort by lastActivityTime desc
      return bTime - aTime;
    });

  return (
    <div className="flex flex-col gap-y-2 pt-2 pb-4">
      <div className="relative mb-4 w-full">
        <FilterTextBox
          placeHolderText="Filter by name or alias"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {filteredManagedServers &&
        filteredManagedServers.map((managedServer) => (
          <ManagedServerCard
            managedServer={managedServer}
            key={managedServer.userPrincipalName}
          />
        ))}
    </div>
  );
}

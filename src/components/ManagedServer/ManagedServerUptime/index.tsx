import { useEffect, useState } from "react";
import { ManagedServer } from "../../../dataStructures";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerUptime(props: Props) {
  const { managedServer } = props;

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const deployedAt = new Date(managedServer.deployedAtTime);
  const destroyedAt = managedServer.destroyedAtTime
    ? new Date(managedServer.destroyedAtTime)
    : now;
  let uptimeMs = destroyedAt.getTime() - deployedAt.getTime();

  if (uptimeMs < 0) {
    uptimeMs = now.getTime() - deployedAt.getTime();
  }

  const seconds = Math.floor((uptimeMs / 1000) % 60);
  const minutes = Math.floor((uptimeMs / 1000 / 60) % 60);
  const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${seconds}s`;

  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="font-bold">Uptime</p>
      <div className="min-w-36">
        <Tooltip
          message="Uptime of the Managed Server"
          fullWidth={true}
          delay={500}
        >
          {result}
        </Tooltip>
      </div>
    </div>
  );
}

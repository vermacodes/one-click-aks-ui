import { useEffect, useState } from "react";
import { ManagedServer } from "../../../dataStructures";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerDurationSinceLastActivity(props: Props) {
  const { managedServer } = props;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const lastActivity = new Date(managedServer.lastActivityTime);
  const elapsedMs = now.getTime() - lastActivity.getTime();
  const seconds = Math.floor((elapsedMs / 1000) % 60);
  const minutes = Math.floor((elapsedMs / 1000 / 60) % 60);
  const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${seconds}s`;

  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="font-bold">Inactive For</p>
      <div className="min-w-36">
        <Tooltip
          message="Duration Since Last Activity by User"
          fullWidth={true}
          delay={500}
        >
          {result}
        </Tooltip>
      </div>
    </div>
  );
}

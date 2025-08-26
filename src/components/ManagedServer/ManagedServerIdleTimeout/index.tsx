import { ManagedServer } from "../../../dataStructures";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerIdleTimeout(props: Props) {
  const { managedServer } = props;
  const minutes = Math.floor(
    (managedServer.inactivityDurationInSeconds / 60) % 60,
  );
  const hours = Math.floor(
    (managedServer.inactivityDurationInSeconds / (60 * 60)) % 24,
  );
  const days = Math.floor(
    managedServer.inactivityDurationInSeconds / (60 * 60 * 24),
  );

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;

  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="font-bold">Idle Timeout</p>
      <div className="min-w-20">
        <Tooltip
          message="Idle Timeout - Server will be destroyed if stays idle for this duration"
          fullWidth={true}
          delay={500}
        >
          {result}
        </Tooltip>
      </div>
    </div>
  );
}

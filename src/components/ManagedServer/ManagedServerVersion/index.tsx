import { ManagedServer } from "../../../dataStructures";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  managedServer: ManagedServer;
};
export default function ManagedServerVersion(props: Props) {
  const { managedServer } = props;

  return (
    <div className="flex flex-col gap-2 px-2">
      <p className="font-bold">Version</p>
      <div className="min-w-20">
        <Tooltip
          message="Version of the Managed Server"
          fullWidth={true}
          delay={500}
        >
          {managedServer.version}
        </Tooltip>
      </div>
    </div>
  );
}

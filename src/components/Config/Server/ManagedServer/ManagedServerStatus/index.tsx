import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import {
  defaultUIErrorTextColor,
  defaultUISuccessTextColor,
  defaultUIWarningTextColor,
} from "../../../../../defaults";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";

type Props = {};

export default function ManagedServerStatus({}: Props) {
  const { data: managedServer } = useManagedServer();

  if (!managedServer) return null;

  return (
    <Tooltip
      message={
        `Server Status as seen by Actlabs Hub. ` +
        `If this shows running and server is still not connecting that can be due to DNS sync delay. ` +
        `Try opening https://${managedServer.endpoint}/status in a different tab to ensure DNS resolves correctly and ` +
        `you get a response back. If thee is no response, give it a few minutes and try again.`
      }
      delay={500}
    >
      <div className="flex w-36 gap-4 rounded-sm border border-slate-500 px-2 py-1">
        <div className="flex items-center gap-2">
          {managedServer.status === "Running" && (
            <FaCheckCircle className={defaultUISuccessTextColor} />
          )}
          {managedServer.status.includes("Destroyed") && (
            <FaExclamationCircle className={defaultUIWarningTextColor} />
          )}
          {managedServer.status === "Failed" && (
            <FaExclamationCircle className={defaultUIErrorTextColor} />
          )}
          {managedServer.status}
        </div>
      </div>
    </Tooltip>
  );
}

import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
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
			<div className="flex w-36 gap-4 rounded border border-slate-500 px-2 py-1">
				<div className="flex items-center gap-2">
					{managedServer.status === "Running" && <FaCheckCircle className="text-green-600" />}
					{managedServer.status.includes("Destroyed") && <FaExclamationCircle className="text-amber-500" />}
					{managedServer.status === "Failed" && <FaExclamationCircle className="text-rose-500" />}
					{managedServer.status}
				</div>
			</div>
		</Tooltip>
	);
}

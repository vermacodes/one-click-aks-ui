import { useManagedServer } from "../../../../../hooks/useManagedServer";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";

type Props = {};

export default function ManagedServerVersion({}: Props) {
	const { data: managedServer } = useManagedServer();

	if (!managedServer) return null;

	return (
		<Tooltip message={`Managed Server Version. `} delay={500}>
			<div className="flex w-auto gap-4 rounded border border-slate-500 px-2 py-1">
				<div className="flex items-center gap-2">{managedServer.version || "V1"}</div>
			</div>
		</Tooltip>
	);
}

import { useManagedServer } from "../../../../../hooks/useManagedServer";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";

type Props = {};

export default function ManagedServerDomain({}: Props) {
	const { data: managedServer } = useManagedServer();

	if (managedServer === undefined) {
		return null;
	}

	return (
		<Tooltip message="Your server's domain. Its accessible on https" delay={500}>
			<div className="flex gap-4 rounded-sm border border-slate-500 px-2 py-1">
				<span>{managedServer.endpoint !== "" ? managedServer.endpoint : "Deploy server to see endpoint here.."}</span>
			</div>
		</Tooltip>
	);
}

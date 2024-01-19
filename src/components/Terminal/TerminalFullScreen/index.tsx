import { useContext } from "react";
import { FaCompress, FaTrashAlt } from "react-icons/fa";
import { useSetLogs } from "../../../hooks/useLogs";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { WebSocketContext } from "../../Context/WebSocketContext";
import DeploymentStatus from "../../Deployments/DeploymentStatus";
import Button from "../../UserInterfaceComponents/Button";
import Checkbox from "../../UserInterfaceComponents/Checkbox";

type Props = {
	autoScroll: boolean;
	handleAutoScrollChange: () => void;
	setFullScreen: (args: boolean) => void;
	children: React.ReactNode;
};

export default function TerminalFullScreen({ autoScroll, handleAutoScrollChange, setFullScreen, children }: Props) {
	const { mutate: setLogs } = useSetLogs();
	const { actionStatus } = useContext(WebSocketContext);
	const { selectedDeployment } = useSelectedDeployment();

	return (
		<div className="max-w-ful -gap-x-2 fixed inset-0 z-20 flex max-h-full justify-center bg-slate-800 dark:bg-slate-100 dark:bg-opacity-80">
			<div
				className="w-screen gap-y-2 bg-slate-100 p-0 scrollbar-thin  scrollbar-thumb-slate-400 dark:divide-slate-700 dark:bg-slate-900 dark:scrollbar-thumb-slate-600"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="space-2 sticky top-0 -mb-10 flex items-center justify-end gap-x-2 gap-y-2 divide-x divide-slate-500 bg-slate-800 bg-opacity-90 p-2 text-slate-50">
					<div>{selectedDeployment && <DeploymentStatus deployment={selectedDeployment} />}</div>
					<div className="pl-2">
						<Checkbox
							id="terminal-auto-scroll"
							label="Auto Scroll"
							disabled={false}
							checked={autoScroll}
							handleOnChange={handleAutoScrollChange}
						/>
					</div>
					<Button variant="text" disabled={actionStatus.inProgress} onClick={() => setLogs({ logs: "" })}>
						<FaTrashAlt /> Clear Logs
					</Button>
					<Button variant="text" onClick={() => setFullScreen(false)}>
						<FaCompress /> Minimize
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}

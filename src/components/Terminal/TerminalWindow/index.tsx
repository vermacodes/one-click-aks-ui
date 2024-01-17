import { useContext } from "react";
import { FaExpand, FaTrashAlt } from "react-icons/fa";
import { useSetLogs } from "../../../hooks/useLogs";
import { WebSocketContext } from "../../Context/WebSocketContext";
import Button from "../../UserInterfaceComponents/Button";
import Checkbox from "../../UserInterfaceComponents/Checkbox";
type Props = {
	autoScroll: boolean;
	handleAutoScrollChange: () => void;
	setFullScreen: (args: boolean) => void;
	children: React.ReactNode;
};

export default function TerminalWindow({ autoScroll, handleAutoScrollChange, setFullScreen, children }: Props) {
	const { mutate: setLogs } = useSetLogs();
	const { actionStatus } = useContext(WebSocketContext);

	return (
		<div className="mb-4 mt-4 flex w-full flex-col overflow-auto" style={{ maxHeight: "80vh" }}>
			<div className="space-2 mb-1 flex items-center justify-end gap-x-2 gap-y-2 divide-x divide-slate-500">
				<div className="px-2">
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
				<div className="px-2">
					<Button variant="text" onClick={() => setFullScreen(true)}>
						<FaExpand /> Maximize
					</Button>
				</div>
			</div>
			{children}
		</div>
	);
}

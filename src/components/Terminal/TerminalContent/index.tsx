import ReactHtmlParser from "html-react-parser";
import { useContext, useEffect, useRef } from "react";
import { WebSocketContext } from "../../Context/WebSocketContext";

type Props = {
	autoScroll: boolean;
	updateLogs: () => string;
};

export default function TerminalContent({ autoScroll, updateLogs }: Props) {
	const { logStream: data } = useContext(WebSocketContext);
	const logContainerRef = useRef<null | HTMLDivElement>(null);
	const logContentRef = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		if (autoScroll) {
			logContainerRef.current?.scrollTo({
				top: logContentRef.current?.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [data, autoScroll]);

	return (
		<div
			className="h-screen max-h-screen overflow-y-auto rounded border border-slate-900 bg-[#020617] p-4 text-sm text-slate-100 shadow-slate-300 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-thumb-rounded hover:border-sky-500 dark:scrollbar-thumb-slate-600"
			ref={logContainerRef}
		>
			<div ref={logContentRef} className="w-full overflow-x-clip whitespace-pre-wrap break-words font-mono">
				{ReactHtmlParser(updateLogs())}
			</div>
		</div>
	);
}

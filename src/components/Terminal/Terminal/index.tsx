import ansiHTML from "ansi-to-html";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../Context/WebSocketContext";
import TerminalContent from "../TerminalContent";
import TerminalFullScreen from "../TerminalFullScreen";
import TerminalWindow from "../TerminalWindow";

export default function Terminal() {
	const [autoScroll, setAutoScroll] = useState<boolean>(false);
	const [fullScreen, setFullScreen] = useState<boolean>(false);
	const { logStream: data } = useContext(WebSocketContext);

	function getAutoScrollFromLocalStorage(): string {
		var autoScrollFromLocalStorage = localStorage.getItem("autoScroll");
		if (autoScrollFromLocalStorage !== null) {
			return autoScrollFromLocalStorage;
		}

		return "";
	}

	function setAutoScrollInLocalStorage(autoScroll: string) {
		localStorage.setItem("autoScroll", autoScroll);
	}

	useEffect(() => {
		var autoScrollFromLocalStorage = getAutoScrollFromLocalStorage();
		if (autoScrollFromLocalStorage === "true") {
			setAutoScroll(true);
		} else {
			setAutoScroll(false);
		}
	}, []);

	function updateLogs(): string {
		if (data !== undefined) {
			var convert = new ansiHTML({
				newline: false,
				escapeXML: false,
				stream: true,
			});
			const dirty = convert.toHtml(data.logs);

			// Sanitize the HTML string
			const clean = DOMPurify.sanitize(dirty);

			return clean;
		}
		return "";
	}

	function handleAutoScrollChange() {
		if (autoScroll) {
			setAutoScrollInLocalStorage("false");
		} else {
			setAutoScrollInLocalStorage("true");
		}
		setAutoScroll(!autoScroll);
	}

	if (fullScreen) {
		return (
			<TerminalFullScreen
				autoScroll={autoScroll}
				handleAutoScrollChange={handleAutoScrollChange}
				setFullScreen={setFullScreen}
			>
				<TerminalContent autoScroll={autoScroll} updateLogs={updateLogs} />
			</TerminalFullScreen>
		);
	}

	return (
		<TerminalWindow
			autoScroll={autoScroll}
			handleAutoScrollChange={handleAutoScrollChange}
			setFullScreen={setFullScreen}
		>
			<TerminalContent autoScroll={autoScroll} updateLogs={updateLogs} />
		</TerminalWindow>
	);
}

import ReactHtmlParser from "html-react-parser";
import { useContext, useEffect, useRef } from "react";
import { WebSocketContext } from "../../../context/WebSocketContext";
import { defaultScrollbarStyle, getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";

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
      className={cn(
        // Layout and spacing
        "m-1 h-screen max-h-screen overflow-y-auto rounded-sm p-4 shadow-md",
        // Text styling
        "text-sm text-slate-100",
        // Base ring styles
        "ring-3 ring-slate-950 ring-offset-0",
        // Hover effects
        "hover:shadow-lg hover:ring-2 hover:ring-sky-800 hover:ring-offset-1 hover:outline-2 hover:outline-slate-100",
        // Focus styles
        "focus:ring-2 focus:ring-slate-950 focus:ring-offset-1 focus:outline-2 focus:outline-slate-100",
        // Dark mode base ring styles
        "dark:ring-1 dark:ring-slate-500 dark:ring-offset-2 dark:outline-3 dark:outline-slate-950",
        // Dark mode hover styles
        "hover:ring-offset-1 hover:outline-2 hover:outline-slate-950 dark:hover:shadow-lg dark:hover:ring-1 dark:hover:ring-sky-400",
        // Dark mode focus styles
        "dark:focus:ring-2 dark:focus:ring-slate-950 dark:focus:ring-offset-1 dark:focus:outline-2 dark:focus:outline-slate-100",
        // Utility styles
        defaultScrollbarStyle,
        getUIStateColors({ colors: "dark" }),
        "contrast-more:border",
      )}
      ref={logContainerRef}
      tabIndex={0}
      aria-label="Terminal Log"
      role="log"
    >
      <div
        ref={logContentRef}
        className="w-full overflow-x-clip font-mono break-words whitespace-pre-wrap"
      >
        {ReactHtmlParser(updateLogs())}
      </div>
    </div>
  );
}

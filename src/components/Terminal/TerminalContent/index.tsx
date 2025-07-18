import ReactHtmlParser from "html-react-parser";
import { useContext, useEffect, useRef } from "react";
import { defaultScrollbarStyle, getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
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
      className={cn(
        "h-screen max-h-screen overflow-y-auto rounded-sm p-4 text-sm text-slate-100 focus:m-1 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-50 dark:focus:ring-offset-0",
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

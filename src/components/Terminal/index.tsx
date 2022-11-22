import { useEffect, useRef, useState } from "react";
import { useLogs } from "../../hooks/useLogs";
import ansiHTML from "ansi-to-html";
import Checkbox from "../Checkbox";

export default function Terminal() {
    const [autoScroll, setAutoScroll] = useState(true);
    const { data } = useLogs();

    const logEndRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    function updateLogs(): string {
        if (data) {
            var convert = new ansiHTML({
                newline: false,
                escapeXML: false,
                stream: true,
            });
            return convert.toHtml(data.logs);
        }
        return "";
    }

    function handleOnChange() {
        setAutoScroll(!autoScroll);
    }

    return (
        <>
            <div className="flex justify-end">
                <Checkbox
                    id="terminal-autoscroll"
                    label="Auto Scroll"
                    disabled={false}
                    checked={autoScroll}
                    handleOnChange={handleOnChange}
                />
            </div>
            <div className="text-sm rounded shadow shadow-slate-900 dark:shadow-slate-200 border-slate-900 dark:border-slate-200 h-1/2 min-h-[500px] max-h-[500px] overflow-y-scroll">
                <pre
                    dangerouslySetInnerHTML={{ __html: updateLogs() }}
                    style={{ padding: "10px", whiteSpace: "pre-wrap" }}
                ></pre>

                {autoScroll && <div ref={logEndRef} />}
            </div>
        </>
    );
}

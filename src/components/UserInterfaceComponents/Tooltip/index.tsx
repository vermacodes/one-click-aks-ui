import { useEffect, useState } from "react";

type Props = {
  message?: string;
  children: React.ReactNode;
  delay?: number; // in milliseconds
  direction?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
};

export default function Tooltip({ message, children, delay = 100, direction = "bottom", align = "center" }: Props) {
  const [visible, setVisible] = useState(false);
  const [mouseOn, setMouseOn] = useState(false);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    if (mouseOn) {
      timer = setTimeout(() => setVisible(true), delay);
    }

    return () => {
      clearTimeout(timer);
      setVisible(false);
    };
  }, [mouseOn]);

  return (
    <div className="relative flex" onMouseEnter={() => setMouseOn(true)} onMouseLeave={() => setMouseOn(false)}>
      {children}
      {message && visible && (
        <div
          className={`absolute
          z-10 w-48 min-w-fit transform whitespace-pre-wrap rounded bg-slate-800 p-2 text-xs text-slate-100
          transition-all  dark:bg-slate-100 dark:text-slate-900 
          ${direction === "top" ? "bottom-full -translate-y-2" : ""}
          ${direction === "bottom" ? "top-full translate-y-2" : ""}
          ${direction === "left" ? "right-full -translate-x-2" : ""}
          ${direction === "right" ? "left-full translate-x-2" : ""}
          ${align === "center" ? "left-1/2 -translate-x-1/2" : ""}
          ${align === "end" ? "right-0" : ""}
        `}
        >
          {message}
        </div>
      )}
    </div>
  );
}

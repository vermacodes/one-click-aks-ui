import { useEffect, useState } from "react";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn"; // Adjust the import path as needed

type Props = {
  message?: string;
  children: React.ReactNode;
  delay?: number; // in milliseconds
  direction?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  fullWidth?: boolean; // New prop to make w-full conditional
};

export default function Tooltip({
  message,
  children,
  delay = 100,
  direction = "bottom",
  align = "center",
  fullWidth = false, // Default to false
}: Props) {
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
    <div
      className={cn(
        "relative flex",
        fullWidth && "w-full", // Conditionally apply w-full
      )}
      onMouseEnter={() => setMouseOn(true)}
      onMouseLeave={() => setMouseOn(false)}
      onFocus={() => setMouseOn(true)} // Show tooltip when the child is focused
      onBlur={() => setMouseOn(false)} // Hide tooltip when the child loses focus
    >
      {children}
      {message && visible && (
        <div
          className={cn(
            "absolute z-10 min-w-fit transform rounded p-2 text-xs whitespace-pre-wrap transition-all",
            {
              "bottom-full -translate-y-2": direction === "top",
              "top-full translate-y-2": direction === "bottom",
              "right-full -translate-x-2": direction === "left",
              "left-full translate-x-2": direction === "right",
              "left-1/2 -translate-x-1/2": align === "center",
              "right-0": align === "end",
            },
            {
              "w-full": fullWidth, // Apply w-full if fullWidth is true
            },
            getUIStateColors({ inverted: true }),
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}

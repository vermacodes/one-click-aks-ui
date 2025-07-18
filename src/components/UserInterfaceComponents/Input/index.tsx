import { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn"; // Adjust the import path as needed
import Tooltip from "../Tooltip";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  tooltipMessage?: string;
  tooltipDelay?: number;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
  fullWidth?: boolean;
};

export default function Input({
  tooltipMessage,
  tooltipDelay,
  tooltipDirection,
  tooltipAlign,
  fullWidth = false,
  ...rest
}: Props) {
  // take out className from rest and ignore it
  const { className: restClassName, ...otherRest } = rest;

  return (
    <Tooltip
      message={tooltipMessage}
      delay={tooltipDelay}
      direction={tooltipDirection}
      align={tooltipAlign}
      fullWidth={fullWidth}
    >
      <input
        {...otherRest}
        className={cn(
          "w-full rounded-sm border border-slate-500 px-2 py-1",
          "dark:border-slate-600 dark:placeholder:text-slate-500",
          "placeholder-slate-600 dark:placeholder-slate-400",
          rest.className, // Include additional classes passed via props
        )}
      />
    </Tooltip>
  );
}

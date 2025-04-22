import { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn"; // Adjust the import path as needed
import Tooltip from "../Tooltip";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  tooltipMessage?: string;
  tooltipDelay?: number;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
};

export default function Input({
  tooltipMessage,
  tooltipDelay,
  tooltipDirection,
  tooltipAlign,
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
    >
      <input
        {...otherRest}
        className={cn(
          "w-full rounded-sm border border-slate-500 px-2 py-1 placeholder:text-slate-400",
          "dark:border-slate-600 dark:placeholder:text-slate-500",
          rest.className, // Include additional classes passed via props
        )}
      />
    </Tooltip>
  );
}

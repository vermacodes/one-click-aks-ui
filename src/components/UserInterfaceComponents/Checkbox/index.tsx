import { InputHTMLAttributes } from "react";
import Tooltip from "../Tooltip";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  tooltipMessage?: string;
  tooltipDelay?: number;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
  handleOnChange(args: void): void;
};

export default function Checkbox({
  id,
  label,
  tooltipMessage,
  tooltipDelay,
  tooltipDirection,
  tooltipAlign,
  handleOnChange,
  ...rest
}: CheckboxProps) {
  const { checked = false, disabled = false, ...otherProps } = rest;

  return (
    <Tooltip
      message={tooltipMessage}
      delay={tooltipDelay}
      direction={tooltipDirection}
      align={tooltipAlign}
    >
      <div className="flex items-center gap-x-2 rounded-sm px-1 focus-within:outline-2">
        {/* Hidden input for form submission */}
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          onChange={() => handleOnChange()}
          checked={checked}
          disabled={disabled}
          {...otherProps}
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault(); // Prevent default scrolling behavior for Space
              handleOnChange();
            }
          }}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled} // Indicate if the checkbox is disabled
          aria-label={label} // Provide an accessible label
        />
        {/* Visual representation of the checkbox */}
        <label
          htmlFor={id}
          className={`flex h-4 min-h-4 w-8 min-w-8 items-center rounded-full transition-all duration-100 hover:cursor-pointer ${
            checked ? "bg-green-500" : "bg-slate-500"
          } ${
            disabled &&
            "bg-slate-300 hover:cursor-not-allowed dark:bg-slate-700"
          } `}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white transition-all duration-100 ${
              checked && "ml-4"
            } ${disabled && "dark:bg-slate-600"}`}
          ></div>
        </label>
        {/* Accessible label for the checkbox */}
        <span
          className={`text-md ${
            disabled && "text-slate-600 dark:text-slate-400"
          } transition-all duration-100`}
        >
          {label}
        </span>
      </div>
    </Tooltip>
  );
}

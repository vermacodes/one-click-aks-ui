import { InputHTMLAttributes } from "react";
import { FaCircle } from "react-icons/fa";
import {
  defaultUISecondaryTextColor,
  defaultUITextColor,
  getUIStateColors,
} from "../../../defaults";
import { cn } from "../../../utils/cn"; // Ensure the correct import path for the cn utility
import Tooltip from "../Tooltip";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  tooltipMessage?: string;
  tooltipDelay?: number;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
  handleOnChange(args: void): void;
  invertLabelColor?: boolean;
};

export default function Checkbox({
  id,
  label,
  tooltipMessage,
  tooltipDelay,
  tooltipDirection,
  tooltipAlign,
  handleOnChange,
  invertLabelColor = false,

  ...rest
}: CheckboxProps) {
  const { checked = false, disabled = false, className, ...otherProps } = rest;

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
          className={cn(
            "flex h-4 min-h-4 w-8 min-w-8 items-center rounded-full transition-all duration-100",
            getUIStateColors({
              colors: `${checked ? "success" : "secondary"}`,
              disabled: disabled,
            }),
            {
              "cursor-pointer": !disabled,
            },
            "contrast-more:h-5 contrast-more:min-h-5 contrast-more:w-10 contrast-more:min-w-10 contrast-more:border",
          )}
        >
          {/* <div
            className={cn(
              "h-4 w-4 rounded-full transition-all duration-100",
              checked && "ml-4",
              getUIStateColors({
                colors: "light",
                disabled: disabled,
              }),
            )}
          ></div> */}
          <FaCircle
            className={cn(
              "h-4 w-4 rounded-full transition-all duration-100",
              checked && "ml-4",
              // getUIStateColors({
              //   colors: "light",
              //   disabled: disabled,
              // }),
              defaultUITextColor,
              "contrast-more:ml-0.5 contrast-more:h-3 contrast-more:w-3",
              checked
                ? "contrast-more:ml-6 contrast-more:border-green-400 contrast-more:fill-green-400"
                : "contrast-more:bg-slate-300",
            )}
            role="text"
          />
          {/* <FaCircle
            className={cn(
              "h-4 w-4 rounded-full transition-all duration-100",
              checked && "ml-4",
              defaultUITextColor,
              "contrast-more:ml-0.5 contrast-more:h-3 contrast-more:w-3",
              checked
                ? "contrast-more:ml-6 contrast-more:border-green-400"
                : "contrast-more:bg-slate-300",
            )}
            style={{
              fill: "currentColor", // Use currentColor to adapt to High Contrast mode
            }}
          /> */}
        </label>
        {/* Accessible label for the checkbox */}
        <span
          className={cn(
            "text-md transition-all duration-100",
            defaultUITextColor,
            disabled && defaultUISecondaryTextColor,
            className,
          )}
        >
          {label}
        </span>
      </div>
    </Tooltip>
  );
}

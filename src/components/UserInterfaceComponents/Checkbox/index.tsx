import { InputHTMLAttributes } from "react";
import { FaCircle } from "react-icons/fa";
import {
  defaultUIDisabledTextColor,
  defaultUIInvertedTextColor,
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
      <div className="flex items-center gap-x-2 rounded-sm px-1">
        {/* Accessible button for the checkbox */}
        <button
          id={id}
          name={label}
          aria-labelledby={`${id}-label`}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) handleOnChange();
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault(); // Prevent default scrolling behavior for Space
              handleOnChange();
            }
          }}
          disabled={disabled}
          className={cn(
            "flex h-5 w-10 items-center rounded-full outline-offset-2 transition-all duration-100 focus:outline-2",
            getUIStateColors({
              colors: `${checked ? "success" : "secondary"}`,
              disabled: disabled,
            }),
            {
              "cursor-pointer": !disabled,
            },
            "contrast-more:bg-current contrast-more:outline-2 contrast-more:outline-offset-0 contrast-more:focus:outline-3",
          )}
        >
          <FaCircle
            className={cn(
              "ml-1 h-3 w-3 rounded-full transition-all duration-100",
              defaultUIInvertedTextColor,
              checked && "ml-6",
              disabled && defaultUIDisabledTextColor,
              "contrast-more:fill-current contrast-more:text-current",
              "dark:contrast-more:fill-current dark:contrast-more:text-current",
            )}
          />
        </button>
        {/* Accessible label for the checkbox */}
        <span
          id={`${id}-label`}
          className={cn(
            "text-md transition-all duration-100",
            defaultUITextColor,
            disabled && defaultUISecondaryTextColor,
          )}
        >
          {label}
        </span>
      </div>
    </Tooltip>
  );
}

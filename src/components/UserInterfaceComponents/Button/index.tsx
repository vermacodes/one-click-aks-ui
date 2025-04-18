import { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "../../../dataStructures";
import Tooltip from "../Tooltip";

type VariantStyles = {
  [key in ButtonVariant]: string;
};

const variantStyles: VariantStyles = {
  primary: `
    ring-1 ring-sky-800 bg-sky-800 py-1 px-3 text-white
    hover:ring-sky-700 hover:bg-sky-700
    disabled:ring-slate-500 disabled:bg-slate-500
    disabled:hover:ring-slate-500 disabled:hover:bg-slate-500 disabled:cursor-not-allowed
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700
  `,
  secondary: `
    ring-1 ring-slate-700 bg-slate-700 py-1 px-3 text-white
    hover:ring-slate-600 hover:bg-slate-600
    disabled:ring-slate-500 disabled:bg-slate-500
    disabled:hover:ring-slate-500 disabled:hover:bg-slate-500 disabled:cursor-not-allowed
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700
  `,
  danger: `
    ring-1 ring-rose-700 bg-rose-700 py-1 px-3 text-white
    hover:ring-rose-600 hover:bg-rose-600
    disabled:ring-slate-500 disabled:bg-slate-500
    disabled:hover:ring-slate-500 disabled:hover:bg-slate-500 disabled:cursor-not-allowed
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700
  `,
  success: `
    ring-1 ring-green-800 bg-green-800 py-1 px-3 text-white
    hover:ring-green-700 hover:bg-green-700
    disabled:ring-slate-500 disabled:bg-slate-500
    disabled:hover:ring-slate-500 disabled:hover:bg-slate-500 disabled:cursor-not-allowed
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700
  `,
  "primary-outline": `
    ring-1 ring-sky-800 py-1 px-3 text-sky-800
    dark:ring-sky-400 dark:text-sky-400
    hover:ring-sky-700 hover:bg-sky-700 hover:text-slate-100
    dark:hover:bg-sky-700 dark:hover:ring-sky-700 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "secondary-outline": `
    ring-1 ring-slate-700 py-1 px-3 text-slate-700
    dark:ring-slate-300 dark:text-slate-300
    hover:ring-slate-600 hover:bg-slate-600 hover:text-slate-100
    dark:hover:bg-slate-600 dark:hover:ring-slate-600 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "danger-outline": `
    ring-1 ring-rose-700 py-1 px-3 text-rose-700
    dark:ring-rose-400 dark:text-rose-400
    hover:ring-rose-600 hover:bg-rose-600 hover:text-rose-100
    dark:hover:bg-rose-600 dark:hover:ring-rose-600 dark:hover:text-rose-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "success-outline": `
    ring-1 ring-emerald-800 py-1 px-3 text-emerald-800
    dark:ring-emerald-400 dark:text-emerald-400
    hover:ring-emerald-700 hover:bg-emerald-700 hover:text-emerald-100
    dark:hover:bg-emerald-700 dark:hover:ring-emerald-700 dark:hover:text-emerald-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "primary-text": `
    ring-0 py-1 px-3 text-sky-800
    dark:ring-sky-400 dark:text-sky-400
    hover:ring-1 hover:ring-sky-700 hover:bg-sky-700 hover:text-slate-100
    dark:hover:bg-sky-700 dark:hover:ring-sky-700 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-0 disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "secondary-text": `
    ring-0 py-1 px-3 text-slate-700
    dark:ring-slate-300 dark:text-slate-300
    hover:ring-1 hover:ring-slate-600 hover:bg-slate-600 hover:text-slate-100
    dark:hover:bg-slate-600 dark:hover:ring-slate-600 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-0 disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "danger-text": `
    ring-0 py-1 px-3 text-rose-700
    dark:ring-rose-400 dark:text-rose-400
    hover:ring-1 hover:ring-rose-600 hover:bg-rose-600 hover:text-slate-100
    dark:hover:bg-rose-600 dark:hover:ring-rose-600 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-0 disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  "success-text": `
    ring-0 py-1 px-3 text-emerald-800
    dark:ring-emerald-400 dark:text-emerald-400
    hover:ring-1 hover:ring-emerald-700 hover:bg-emerald-700 hover:text-slate-100
    dark:hover:bg-emerald-700 dark:hover:ring-emerald-700 dark:hover:text-slate-100
    disabled:ring-slate-500 disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:ring-0 disabled:hover:ring-slate-500 disabled:hover:bg-inherit disabled:hover:text-slate-500
    dark:disabled:ring-slate-500 dark:disabled:text-slate-500
    dark:disabled:hover:ring-slate-500 dark:disabled:hover:bg-inherit dark:disabled:hover:text-slate-500
  `,
  text: `
    py-1 px-3 text-slate-900
    hover:text-sky-800 
    dark:text-slate-100 
    dark:hover:text-sky-400 
    disabled:text-slate-500 disabled:cursor-not-allowed
    disabled:hover:text-slate-500 disabled:hover:bg-inherit
    dark:disabled:text-slate-500
    dark:disabled:hover:text-slate-500 dark:disabled:hover:bg-inherit
  `,
  "primary-icon": `
    rounded-full py-2 px-2 text-sky-700
    hover:bg-sky-500 hover:bg-opacity-30
    disabled:text-slate-400 disabled:hover:bg-transparent
    dark:text-sky-400 dark:hover:bg-sky-400 dark:hover:bg-opacity-30 dark:disabled:text-slate-500
  `,
  "secondary-icon": `
    rounded-full py-2 px-2 text-slate-700
    hover:bg-slate-500 hover:bg-opacity-30
    disabled:text-slate-400 disabled:hover:bg-transparent
    dark:text-slate-400 dark:hover:bg-slate-400 dark:hover:bg-opacity-30 dark:disabled:text-slate-500
  `,
  "danger-icon": `
    rounded-full py-2 px-2 text-rose-700
    hover:bg-rose-500 hover:bg-opacity-30
    disabled:text-slate-400 disabled:hover:bg-transparent
    dark:text-rose-500 dark:hover:bg-rose-500 dark:hover:bg-opacity-30 dark:disabled:text-slate-500
  `,
};

function getClassName(variant: ButtonVariant, hidden?: boolean) {
  let className =
    "text-bold flex items-center focus-visible:outline-2 gap-2 rounded whitespace-nowrap";
  if (hidden) className += " hidden";
  className += " " + variantStyles[variant];
  return className;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  hidden?: boolean;
  tooltipMessage?: string;
  tooltipDelay?: number;
  tooltipDirection?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
};

export default function Button({
  variant = "text",
  hidden,
  tooltipMessage,
  tooltipDelay,
  tooltipDirection,
  tooltipAlign,
  children,
  ...rest
}: Props) {
  const className = getClassName(variant, hidden);

  return (
    <Tooltip
      message={tooltipMessage}
      delay={tooltipDelay}
      direction={tooltipDirection}
      align={tooltipAlign}
    >
      <button className={className} {...rest} tabIndex={0} type="button">
        {children}
      </button>
    </Tooltip>
  );
}

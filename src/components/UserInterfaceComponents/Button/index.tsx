import { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "../../../dataStructures";
import Tooltip from "../Tooltip";

type VariantStyles = {
  [key in ButtonVariant]: string;
};

const variantStyles: VariantStyles = {
  primary: `
    ring-1 ring-sky-700 bg-sky-700 py-1 px-3 text-white
    disabled:ring-slate-400 disabled:bg-slate-400
    hover:ring-sky-800 hover:bg-sky-800
    disabled:hover:ring-slate-400 disabled:hover:bg-slate-400
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500
  `,
  secondary: `
    ring-1 ring-slate-600 bg-slate-600 py-1 px-3 text-white
    disabled:ring-slate-400 disabled:bg-slate-400
    hover:ring-slate-700 hover:bg-slate-700
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500
  `,
  danger: `
    ring-1 ring-rose-500 bg-rose-500 py-1 px-3 text-white
    disabled:ring-slate-400 disabled:bg-slate-400
    hover:ring-rose-700 hover:bg-rose-700
    disabled:hover:ring-slate-400 disabled:hover:bg-slate-400
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500
  `,
  success: `
    ring-1 ring-green-500 bg-green-500 py-1 px-3 text-white
    disabled:ring-slate-400 disabled:bg-slate-400
    hover:ring-green-700 hover:bg-green-700
    disabled:hover:ring-slate-400 disabled:hover:bg-slate-400
    dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500
  `,
  "primary-outline": `
    ring-1 ring-sky-700 py-1 px-3 text-sky-700
    disabled:ring-slate-400 disabled:text-slate-400
    hover:ring-sky-700 hover:bg-sky-700 hover:text-slate-100
    disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400
    dark:disabled:ring-slate-700 dark:disabled:text-slate-500
  `,
  "secondary-outline": `
    ring-1 ring-slate-700 py-1 px-3 text-slate-700
    disabled:ring-slate-400 disabled:text-slate-400
    hover:ring-slate-700 hover:bg-slate-700 hover:text-slate-100
    disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400
    dark:ring-slate-400 dark:text-slate-400 dark:disabled:ring-slate-700 dark:disabled:text-slate-500
  `,
  "danger-outline": `
    ring-1 ring-rose-700 py-1 px-3 text-rose-700
    disabled:ring-slate-400 disabled:text-slate-400
    hover:ring-rose-700 hover:bg-rose-700 hover:text-slate-100
    disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400
    dark:ring-rose-500 dark:text-rose-500 dark:hover:bg-rose-500 dark:hover:text-white
    dark:disabled:ring-slate-700 dark:disabled:text-slate-500
  `,
  "success-outline": `
    ring-1 ring-green-500 py-1 px-3 text-green-500
    disabled:ring-slate-400 disabled:text-slate-400
    hover:ring-green-700 hover:bg-green-700 hover:text-slate-100
    disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400
    dark:ring-green-500 dark:text-green-500 dark:disabled:ring-slate-700 dark:disabled:text-slate-500
  `,
  "primary-text": `
    ring-0 py-1 px-3 text-sky-700
    hover:ring-1 hover:ring-sky-500 hover:bg-sky-500 hover:bg-opacity-20
    disabled:text-slate-400 disabled:hover:ring-0 disabled:hover:bg-inherit
    dark:ring-slate-900 dark:hover:ring-sky-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit
  `,
  "secondary-text": `
    ring-0 py-1 px-3 text-slate-700
    hover:ring-1 hover:ring-slate-500 hover:bg-slate-500 hover:bg-opacity-20
    disabled:text-slate-400 disabled:hover:ring-0 disabled:hover:bg-inherit
    dark:ring-slate-900 dark:hover:ring-slate-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit
  `,
  "danger-text": `
    ring-0 py-1 px-3 text-rose-700
    hover:ring-1 hover:ring-rose-500 hover:bg-rose-500 hover:bg-opacity-20
    disabled:text-slate-400 disabled:hover:ring-0 disabled:hover:bg-inherit
    dark:ring-slate-900 dark:hover:ring-rose-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit
  `,
  "success-text": `
    ring-0 py-1 px-3 text-green-700
    hover:ring-1 hover:ring-green-500 hover:bg-green-500 hover:bg-opacity-20
    disabled:text-slate-400 disabled:hover:ring-0 disabled:hover:bg-inherit
    dark:ring-slate-900 dark:hover:ring-green-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit
  `,
  text: `
    px-3 text-gray-800
    hover:text-sky-700 disabled:text-slate-400 disabled:cursor-not-allowed
    dark:text-gray-200 dark:hover:text-sky-400 dark:disabled:text-slate-500
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

// const variantStyles: VariantStyles = {
// 	primary:
// 		"ring-1 ring-sky-700 bg-sky-700 py-1 px-3 text-white hover:bg-sky-800 hover:ring-sky-800 disabled:bg-slate-400 disabled:ring-slate-400 disabled:text-white dark:bg-sky-700 dark:ring-sky-700 dark:hover:bg-sky-500 dark:hover:ring-sky-500 dark:disabled:bg-slate-600 dark:disabled:ring-slate-600 dark:disabled:text-slate-400",

// 	secondary:
// 		"ring-1 ring-gray-600 bg-gray-600 py-1 px-3 text-white hover:bg-gray-700 hover:ring-gray-700 disabled:bg-gray-400 disabled:ring-gray-400 disabled:text-white dark:bg-gray-500 dark:ring-gray-500 dark:hover:bg-gray-400 dark:hover:ring-gray-400 dark:disabled:bg-gray-600 dark:disabled:ring-gray-600 dark:disabled:text-gray-400",

// 	danger:
// 		"ring-1 ring-red-600 bg-red-600 py-1 px-3 text-white hover:bg-red-700 hover:ring-red-700 disabled:bg-slate-400 disabled:ring-slate-400 disabled:text-white dark:bg-red-500 dark:ring-red-500 dark:hover:bg-red-400 dark:hover:ring-red-400 dark:disabled:bg-slate-600 dark:disabled:ring-slate-600 dark:disabled:text-slate-400",

// 	success:
// 		"ring-1 ring-emerald-600 bg-emerald-600 py-1 px-3 text-white hover:bg-emerald-700 hover:ring-emerald-700 disabled:bg-slate-400 disabled:ring-slate-400 disabled:text-white dark:bg-emerald-500 dark:ring-emerald-500 dark:hover:bg-emerald-400 dark:hover:ring-emerald-400 dark:disabled:bg-slate-600 dark:disabled:ring-slate-600 dark:disabled:text-slate-400",

// 	"primary-outline":
// 		"ring-1 ring-sky-700 text-sky-700 py-1 px-3 hover:bg-sky-700 hover:text-white disabled:ring-slate-400 disabled:text-slate-400 hover:disabled:bg-transparent hover:disabled:text-slate-400 dark:ring-sky-400 dark:text-sky-400 dark:hover:bg-sky-400 dark:hover:text-black dark:disabled:ring-slate-600 dark:disabled:text-slate-500",

// 	"secondary-outline":
// 		"ring-1 ring-gray-700 text-gray-700 py-1 px-3 hover:bg-gray-700 hover:text-white disabled:ring-slate-400 disabled:text-slate-400 dark:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-400 dark:hover:text-black dark:disabled:ring-slate-600 dark:disabled:text-slate-500",

// 	"danger-outline":
// 		"ring-1 ring-red-700 text-red-700 py-1 px-3 hover:bg-red-700 hover:text-white disabled:ring-slate-400 disabled:text-slate-400 dark:ring-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:disabled:ring-slate-600 dark:disabled:text-slate-500",

// 	"success-outline":
// 		"ring-1 ring-emerald-600 text-emerald-600 py-1 px-3 hover:bg-emerald-700 hover:text-white disabled:ring-slate-400 disabled:text-slate-400 dark:ring-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-black dark:disabled:ring-slate-600 dark:disabled:text-slate-500",

// 	"primary-text":
// 		"ring-0 py-1 px-3 text-sky-700 hover:bg-sky-500 hover:bg-opacity-20 hover:ring-1 hover:ring-sky-500 disabled:text-slate-400 dark:text-sky-400 dark:hover:bg-sky-400 dark:hover:bg-opacity-20 dark:hover:ring-sky-400 dark:disabled:text-slate-500",

// 	"secondary-text":
// 		"ring-0 py-1 px-3 text-gray-700 hover:bg-gray-500 hover:bg-opacity-20 hover:ring-1 hover:ring-gray-500 disabled:text-slate-400 dark:text-gray-400 dark:hover:bg-gray-400 dark:hover:bg-opacity-20 dark:hover:ring-gray-400 dark:disabled:text-slate-500",

// 	"danger-text":
// 		"ring-0 py-1 px-3 text-red-700 hover:bg-red-500 hover:bg-opacity-20 hover:ring-1 hover:ring-red-500 disabled:text-slate-400 dark:text-red-500 dark:hover:bg-red-500 dark:hover:bg-opacity-20 dark:hover:ring-red-500 dark:disabled:text-slate-500",

// 	"success-text":
// 		"ring-0 py-1 px-3 text-emerald-700 hover:bg-emerald-500 hover:bg-opacity-20 hover:ring-1 hover:ring-emerald-500 disabled:text-slate-400 dark:text-emerald-400 dark:hover:bg-emerald-400 dark:hover:bg-opacity-20 dark:hover:ring-emerald-400 dark:disabled:text-slate-500",

// 	text: "px-3 text-gray-800 hover:text-sky-700 disabled:text-slate-400 disabled:cursor-not-allowed dark:text-gray-200 dark:hover:text-sky-400 dark:disabled:text-slate-500",

// 	"primary-icon":
// 		"rounded-full py-2 px-2 text-sky-700 hover:bg-sky-500 hover:bg-opacity-30 disabled:text-slate-400 disabled:hover:bg-transparent dark:text-sky-400 dark:hover:bg-sky-400 dark:hover:bg-opacity-30 dark:disabled:text-slate-500",

// 	"secondary-icon":
// 		"rounded-full py-2 px-2 text-gray-700 hover:bg-gray-500 hover:bg-opacity-30 disabled:text-slate-400 disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-400 dark:hover:bg-opacity-30 dark:disabled:text-slate-500",

// 	"danger-icon":
// 		"rounded-full py-2 px-2 text-red-700 hover:bg-red-500 hover:bg-opacity-30 disabled:text-slate-400 disabled:hover:bg-transparent dark:text-red-500 dark:hover:bg-red-500 dark:hover:bg-opacity-30 dark:disabled:text-slate-500",
// };

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

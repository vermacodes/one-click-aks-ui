import { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "../../../dataStructures";
import Tooltip from "../Tooltip";

type VariantStyles = {
	[key in ButtonVariant]: string;
};

const variantStyles: VariantStyles = {
	primary:
		"ring-1 ring-sky-600 bg-sky-600 py-1 px-3 text-white disabled:ring-slate-400 disabled:bg-slate-400 hover:ring-sky-700 hover:bg-sky-700 disabled:hover:ring-slate-400 disabled:hover:bg-slate-400 dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500",
	secondary:
		"ring-1 ring-slate-500 bg-slate-500 py-1 px-3 text-white disabled:ring-slate-400 disabled:bg-slate-400 hover:ring-slate-700 hover:bg-slate-700 disabled:hover:ring-slate-400 disabled:hover:bg-slate-400 dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500",
	danger:
		"ring-1 ring-rose-500 bg-rose-500 py-1 px-3 text-white disabled:ring-slate-400 disabled:bg-slate-400 hover:ring-rose-700 hover:bg-rose-700 disabled:hover:ring-slate-400 disabled:hover:bg-slate-400 dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500",
	success:
		"ring-1 ring-green-500 bg-green-500 py-1 px-3 text-white disabled:ring-slate-400 disabled:bg-slate-400 hover:ring-green-700 hover:bg-green-700 disabled:hover:ring-slate-400 disabled:hover:bg-slate-400 dark:disabled:ring-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 ",
	"primary-outline":
		"ring-1 ring-sky-500 py-1 px-3 text-sky-500 disabled:ring-slate-400 disabled:text-slate-400 hover:ring-sky-700 hover:bg-sky-700  hover:text-slate-100 disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400 dark:disabled:ring-slate-700 dark:disabled:text-slate-500 ",
	"secondary-outline":
		"ring-1 ring-slate-500 py-1 px-3 text-slate-500 disabled:ring-slate-400 disabled:text-slate-400 hover:ring-slate-700 hover:bg-slate-700  hover:text-slate-100 disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400 dark:disabled:ring-slate-700 dark:disabled:text-slate-500 ",
	"danger-outline":
		"ring-1 ring-rose-500 py-1 px-3 text-rose-500 disabled:ring-slate-400 disabled:text-slate-400 hover:ring-rose-700 hover:bg-rose-700  hover:text-slate-100 disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400 dark:disabled:ring-slate-700 dark:disabled:text-slate-500 ",
	"success-outline":
		"ring-1 ring-green-500 py-1 px-3 text-green-500 disabled:ring-slate-400 disabled:text-slate-400 hover:ring-green-700 hover:bg-green-700  hover:text-slate-100 disabled:hover:ring-slate-400 disabled:hover:bg-inherit disabled:hover:text-slate-400 dark:disabled:ring-slate-700 dark:disabled:text-slate-500 ",
	"primary-text":
		"ring-0 hover:ring-1 ring-slate-50 py-1 px-3 disabled:text-slate-400 hover:ring-sky-500 hover:bg-sky-500 hover:bg-opacity-20 disabled:hover:ring-0 disabled:hover:bg-inherit dark:ring-slate-900 dark:hover:ring-sky-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit",
	"secondary-text":
		"ring-0 hover:ring-1 ring-slate-50 py-1 px-3 disabled:text-slate-400 hover:ring-slate-500 hover:bg-slate-500 hover:bg-opacity-20 disabled:hover:ring-0 disabled:hover:bg-inherit dark:ring-slate-900 dark:hover:ring-slate-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit",
	"danger-text":
		"ring-0 hover:ring-1 ring-slate-50 py-1 px-3 disabled:text-slate-400 hover:ring-rose-500 hover:bg-rose-500 hover:bg-opacity-20 disabled:hover:ring-0 disabled:hover:bg-inherit dark:ring-slate-900 dark:hover:ring-rose-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit",
	"success-text":
		"ring-0 hover:ring-1 ring-slate-50 py-1 px-3 disabled:text-slate-400 hover:ring-green-500 hover:bg-green-500 hover:bg-opacity-20 disabled:hover:ring-0 disabled:hover:bg-inherit dark:ring-slate-900 hover:dark:ring-green-500 dark:disabled:hover:ring-0 dark:disabled:hover:bg-inherit",
	text: "px-3 disabled:cursor-not-allowed  disabled:text-slate-400 hover:text-sky-500  disabled:hover:text-slate-400 dark:hover:text-sky-500 dark:disabled:hover:text-slate-400 ",
	"primary-icon":
		"rounded-full py-2 px-2 hover:bg-sky-500 hover:bg-opacity-50 disabled:text-slate-500 disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-900 disabled:cursor-not-allowed ",
	"secondary-icon":
		"rounded-full py-2 px-2 hover:bg-slate-500 hover:bg-opacity-50 disabled:text-slate-500 disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-900 disabled:cursor-not-allowed ",
	"danger-icon":
		"rounded-full py-2 px-2 hover:bg-rose-500 hover:bg-opacity-50 disabled:text-slate-500 disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-900 disabled:cursor-not-allowed ",
};

function getClassName(variant: ButtonVariant, hidden?: boolean) {
	let className = "text-bold flex items-center focus-visible:outline-2 gap-2 rounded whitespace-nowrap";
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
		<Tooltip message={tooltipMessage} delay={tooltipDelay} direction={tooltipDirection} align={tooltipAlign}>
			<button className={className} {...rest} tabIndex={0} type="button">
				{children}
			</button>
		</Tooltip>
	);
}

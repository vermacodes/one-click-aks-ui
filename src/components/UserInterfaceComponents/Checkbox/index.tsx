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
		<Tooltip message={tooltipMessage} delay={tooltipDelay} direction={tooltipDirection} align={tooltipAlign}>
			<div
				className="flex items-center gap-x-2 p-1 focus-visible:outline-2"
				tabIndex={0}
				onKeyDown={(e) => {
					if ((e.key === "Enter" || e.key === " ") && !disabled) {
						e.preventDefault(); // Prevent default scrolling behavior for Space
						handleOnChange();
					}
				}}
				role="checkbox"
				aria-checked={checked}
				aria-label="Checkbox"
			>
				<label
					htmlFor={id}
					className={`flex h-4 w-8 items-center rounded-full transition-all duration-100 hover:cursor-pointer ${
						checked ? "bg-green-500" : "bg-slate-500"
					} ${disabled && "bg-slate-300 hover:cursor-not-allowed dark:bg-slate-700"}
          `}
					tabIndex={-1}
				>
					<input
						type="checkbox"
						id={id}
						className="sr-only"
						onChange={() => handleOnChange()}
						checked={checked}
						disabled={disabled}
						tabIndex={-1}
						{...otherProps}
					/>
					<div
						className={`h-4 w-4 rounded-full bg-white transition-all duration-100 ${checked && "ml-4"} ${
							disabled && "dark:bg-slate-600"
						}`}
						tabIndex={-1}
					></div>
				</label>
				<span
					className={`text-md ${disabled && "text-slate-500 dark:text-slate-500"} transition-all duration-100`}
					tabIndex={-1}
				>
					{label}
				</span>
			</div>
		</Tooltip>
	);
}

import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
};

export default function NumberInput({ label, ...rest }: Props) {
	const { disabled } = rest;
	return (
		<div>
			<form className="flex items-center gap-2 text-nowrap">
				<label htmlFor="minNodes" className={`${disabled && "cursor-not-allowed text-slate-500"}`}>
					{label}
				</label>
				<input
					className={`${
						disabled ? "cursor-not-allowed text-slate-500 " : "cursor-pointer "
					} w-full rounded border border-slate-500 px-2 py-1`}
					{...rest}
				/>
			</form>
		</div>
	);
}

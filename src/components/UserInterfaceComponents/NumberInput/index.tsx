import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function NumberInput({ label, ...rest }: Props) {
  const { disabled } = rest;
  return (
    <div>
      <form className="flex flex-col items-center gap-2 text-nowrap sm:flex-row">
        <label
          htmlFor="numberInput"
          className={`${disabled && "cursor-not-allowed text-slate-500"}`}
        >
          {label}
        </label>
        <input
          id="numberInput"
          className={`${
            disabled ? "cursor-not-allowed text-slate-500" : "cursor-pointer"
          } ::-webkit-outer-spin-button]:m-0 rounded border-none px-2 py-1 ring-1 ring-slate-500 outline-hidden focus:ring-2 focus:ring-sky-500 [&::-webkit-inner-spin-button]:appearance-none`}
          {...rest}
        />
      </form>
    </div>
  );
}

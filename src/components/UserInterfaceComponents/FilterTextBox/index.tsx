import { FaFilter } from "react-icons/fa";

type Props = {
  placeHolderText?: string;
  value: string;
  onChange: (value: string) => void;
  customClasses?: string;
};

export default function FilterTextBox({
  placeHolderText = "Filter",
  value,
  onChange,
  customClasses,
}: Props) {
  return (
    <div className="relative h-full w-full">
      <input
        type="text"
        aria-label="Search"
        placeholder={placeHolderText}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${customClasses} h-full w-full rounded border bg-slate-50 py-1 pl-10 text-lg text-slate-900 shadow ring-1 ring-slate-500 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-700 hover:border-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-300 dark:focus:ring-sky-500 dark:hover:border-sky-500`}
      />
      <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-700 dark:text-gray-300" />
    </div>
  );
}

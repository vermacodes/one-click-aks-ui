import { FaFilter } from "react-icons/fa";
import { cn } from "../../../utils/cn";
import Container from "../Container";

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
    <Container additionalClasses="relative p-0">
      <input
        type="text"
        aria-label="Search"
        placeholder={placeHolderText}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full rounded-sm py-1 pl-10 ring-1 ring-slate-500 focus:ring-2 focus:ring-sky-700 focus:outline-hidden lg:text-lg dark:focus:ring-sky-500",
          "placeholder-slate-600 dark:placeholder-slate-400",
          customClasses,
        )}
      />
      <FaFilter className="absolute top-1/2 left-3 -translate-y-1/2 transform" />
    </Container>
  );
}

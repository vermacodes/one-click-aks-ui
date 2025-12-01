import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../Button";

type Props = {
  codeString: string;
  copyEnabled?: boolean;
  ariaLabel?: string | "Copy to clipboard";
  showPrefix?: boolean;
};

export default function CodeBlock({
  codeString,
  copyEnabled = false,
  ariaLabel,
  showPrefix = true,
}: Props) {
  const [copy, setCopy] = useState<boolean>(false);

  function handleCommandCopy() {
    navigator.clipboard.writeText(codeString);
    setCopy(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }

  return (
    <div
      className={`flex w-full items-start justify-between gap-4 rounded border px-3 py-2 ${
        copy
          ? "border-green-500 bg-green-700/20 dark:bg-green-700/20"
          : "border-slate-400 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"
      }`}
    >
      <div className="flex-1 overflow-x-auto">
        <code className="font-mono text-sm break-words whitespace-pre-wrap">
          {showPrefix && "$ "}
          {codeString}
        </code>
      </div>
      {copyEnabled && (
        <div className="flex-shrink-0">
          <Button
            variant="primary-icon"
            onClick={() => handleCommandCopy()}
            aria-label={ariaLabel || "Copy to clipboard"}
            name="Copy to clipboard"
          >
            {copy ? <FaCheck /> : <MdContentCopy />}
          </Button>
        </div>
      )}
    </div>
  );
}

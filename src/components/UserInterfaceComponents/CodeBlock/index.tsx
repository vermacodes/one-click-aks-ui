import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../Button";

type Props = {
  codeString: string;
  copyEnabled?: boolean;
  ariaLabel?: string | "Copy to clipboard";
};

export default function CodeBlock({ codeString, copyEnabled = false, ariaLabel }: Props) {
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
      className={`flex w-full items-center justify-between gap-4 rounded border-slate-300 bg-slate-300 px-2  py-1 dark:border-slate-700 dark:bg-slate-700 md:w-fit ${
        copy
          ? "border-green-500 bg-green-700 bg-opacity-80 dark:bg-green-700"
          : "border-slate-400 dark:border-slate-600"
      }`}
    >
      <div>
        <code>$ {codeString}</code>
      </div>
      {copyEnabled && (
        <div>
          <Button
            variant="primary-icon"
            onClick={() => handleCommandCopy()}
            aria-label={ariaLabel}
          >
            {copy ? <FaCheck /> : <MdContentCopy />}
          </Button>
        </div>
      )}
    </div>
  );
}

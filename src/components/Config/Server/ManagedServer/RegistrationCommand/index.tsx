import { useState } from "react";
import { MdDoneOutline, MdOutlineContentCopy } from "react-icons/md";
import { SiMicrosoftazure } from "react-icons/si";
import { toast } from "react-toastify";
import Button from "../../../../UserInterfaceComponents/Button";

type Props = {};

export default function ManagedServerRegistrationCommand({}: Props) {
  const bashCommand = "curl -o actlabs.sh -sLO https://aka.ms/ActlabsManagedServer; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh";

  const [copy, setCopy] = useState<boolean>(false);

  function handleCommandCopy() {
    navigator.clipboard.writeText(bashCommand);
    setCopy(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div
        className={`flex max-w-full items-center justify-between gap-4 rounded border-slate-300 bg-slate-300  px-2 py-1 dark:border-slate-700 dark:bg-slate-700 ${
          copy ? "border-green-500 bg-green-700 bg-opacity-80 dark:bg-green-700" : "border-slate-400 dark:border-slate-600"
        }`}
      >
        <div>
          <code>$ {bashCommand}</code>
        </div>
        <div>
          <button className="text-2xl" onClick={() => handleCommandCopy()}>
            {copy ? <MdDoneOutline /> : <MdOutlineContentCopy className="hover:text-sky-500" />}
          </button>
        </div>
      </div>
      <Button variant="primary" onClick={() => window.open("https://shell.azure.com", "_blank")}>
        <SiMicrosoftazure className="h-full" /> {"Cloud Shell"}
      </Button>
    </div>
  );
}

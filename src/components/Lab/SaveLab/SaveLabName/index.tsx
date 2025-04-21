import { useRef, useState } from "react";
import { Lab } from "../../../../dataStructures";
import { labNameSchema } from "../../../../zodSchemas";
import Container from "../../../UserInterfaceComponents/Container";

type Props = {
  lab: Lab;
  setLab(args: Lab): void;
};

export default function SaveLabName({ lab, setLab }: Props) {
  const [labNameError, setLabNameError] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleLabNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newLabName = event.target.value;
    const validationResult = labNameSchema.safeParse(newLabName);
    setLab({
      ...lab,
      name: newLabName,
    });
    setIsModified(true);

    // Clear the previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (validationResult.success) {
      setLabNameError("");
    } else {
      // Set timeout to display error message
      timeoutRef.current = setTimeout(() => {
        const errorMessages = validationResult.error.errors
          .map((err) => err.message)
          .join(" ");
        setLabNameError(errorMessages);
      }, 1000);
    }
  }

  return (
    <Container
      collapsible
      title="Name"
      additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
    >
      <div className="flex flex-col ">
        <input
          className="h-10 rounded-sm border border-slate-500 bg-slate-100 p-2 placeholder:text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:placeholder:text-slate-200 dark:hover:bg-slate-700"
          id="labName"
          type="text"
          placeholder="Lab name"
          value={lab.name}
          onChange={(e) => handleLabNameChange(e)}
        />
      </div>
      {isModified && labNameError && (
        <div className="rounded-sm border border-rose-500 bg-rose-500 bg-opacity-20 p-2">
          <p className="error-message">{labNameError}</p>
        </div>
      )}
    </Container>
  );
}

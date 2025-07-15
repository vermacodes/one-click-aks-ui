import { useRef, useState } from "react";
import { Lab } from "../../../../dataStructures";
import { cn } from "../../../../utils/cn";
import { labNameSchema } from "../../../../zodSchemas";
import Alert from "../../../UserInterfaceComponents/Alert";
import Container from "../../../UserInterfaceComponents/Container";
import Input from "../../../UserInterfaceComponents/Input";

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
      <div className="flex flex-col">
        <Input
          className={cn(
            isModified &&
              labNameError &&
              "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
          )}
          id="labName"
          type="text"
          placeholder="Lab name"
          value={lab.name}
          onChange={(e) => handleLabNameChange(e)}
        />
      </div>
      {isModified && labNameError && (
        <Alert
          variant="danger"
          className="mt-2 rounded-sm p-2"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id="labNameError"
        >
          <p className="error-message">{labNameError}</p>
        </Alert>
      )}
    </Container>
  );
}

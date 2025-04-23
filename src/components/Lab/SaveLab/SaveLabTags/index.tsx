import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Lab } from "../../../../dataStructures";
import { getUIStateColors } from "../../../../defaults";
import { cn } from "../../../../utils/cn";
import { labTagSchema } from "../../../../zodSchemas";
import Alert from "../../../UserInterfaceComponents/Alert";
import Container from "../../../UserInterfaceComponents/Container";
import Input from "../../../UserInterfaceComponents/Input";

type Props = {
  lab: Lab;
  setLab(args: Lab): void;
};

export default function SaveLabTags({ lab, setLab }: Props) {
  const [tagError, setTagError] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const [tag, setTag] = useState<string>("");

  // Function to handle the form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If the tag is not valid, return
    if (!labTagSchema.safeParse(tag).success) {
      return;
    }

    setLab({ ...lab, tags: [...lab.tags, tag] });
    setTag("");
  };

  // Function to handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    const validationResult = labTagSchema.safeParse(tag);
    setTag(tag.replace(" ", "_"));
    setIsModified(true);

    if (validationResult.success) {
      setTagError("");
    } else {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(" ");
      setTagError(errorMessages);
    }
  };

  return (
    <Container
      collapsible
      title="Tags"
      additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
    >
      <Tags lab={lab} setLab={setLab} />
      <div className="flex flex-col">
        <form className="w-full" onSubmit={handleFormSubmit}>
          <Input
            className={cn(
              isModified &&
                tagError &&
                "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
            )}
            id="tags"
            type="text"
            value={tag}
            placeholder="Add tag"
            onChange={handleInputChange}
          />
        </form>
      </div>
      {isModified && tagError && (
        <Alert
          variant="danger"
          className="mt-2 rounded-sm p-2"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id="labTagsError"
        >
          <p className="error-message">{tagError}</p>
        </Alert>
      )}
    </Container>
  );
}

type TagsPros = {
  lab: Lab;
  setLab(args: Lab): void;
};

function Tags({ lab, setLab }: TagsPros) {
  function deleteTag(tagToBeDeleted: string) {
    var filteredTags = lab.tags.filter((tag) => tag !== tagToBeDeleted);
    setLab({ ...lab, tags: filteredTags });
  }

  return (
    <div className="mb-4 flex flex-auto space-x-1 rounded-sm">
      {lab.tags &&
        lab.tags.map((tag) => (
          <div
            key={tag}
            className={cn(
              "flex items-center justify-between gap-x-2",
              "rounded-sm",
              "px-2 text-lg",
              getUIStateColors({ inverted: true }),
            )}
          >
            {tag}
            <button onClick={() => deleteTag(tag)} aria-label="Delete tag">
              <FaTimes className="text-rose-500 dark:text-rose-700" />
            </button>
          </div>
        ))}
    </div>
  );
}

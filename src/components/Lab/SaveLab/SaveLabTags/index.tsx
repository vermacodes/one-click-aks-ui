import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Lab } from "../../../../dataStructures";
import { labTagSchema } from "../../../../zodSchemas";
import Container from "../../../UserInterfaceComponents/Container";

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
      <div className="flex items-center gap-x-2 rounded-sm border border-slate-500 bg-inherit focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 hover:bg-slate-200 dark:hover:bg-slate-700">
        <Tags lab={lab} setLab={setLab} />
        <form className="w-full" onSubmit={handleFormSubmit}>
          <input
            id="tags"
            type="text"
            value={tag}
            placeholder="Add tag"
            className="px w-full border-none bg-inherit p-2 py-2 outline-hidden placeholder:text-slate-800 dark:placeholder:text-slate-200"
            onChange={handleInputChange}
          />
        </form>
      </div>
      {isModified && tagError && (
        <div className="rounded-sm border border-rose-500 bg-rose-500 bg-opacity-20 p-2">
          <p className="error-message">{tagError}</p>
        </div>
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
    <div className="flex flex-auto space-x-1 rounded-sm px-2">
      {lab.tags &&
        lab.tags.map((tag) => (
          <div
            key={tag}
            className="-p-1 flex items-center justify-between gap-x-2 rounded-sm border border-slate-600 bg-slate-600 px-2 text-lg text-slate-100 dark:border-slate-400 dark:bg-slate-400 dark:text-slate-900"
          >
            {tag}
            <button
              className="text-rose-400 hover:text-rose-500 dark:text-rose-600 dark:hover:text-rose-500"
              onClick={() => deleteTag(tag)}
              aria-label="Delete tag"
            >
              <FaTimes />
            </button>
          </div>
        ))}
    </div>
  );
}

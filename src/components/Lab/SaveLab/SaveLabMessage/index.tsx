import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";
import {
  FaBold,
  FaCode,
  FaFileCode,
  FaHeading,
  FaItalic,
  FaLink,
  FaListUl,
  FaUnlink,
} from "react-icons/fa";
import { Lab } from "../../../../dataStructures";
import { decodeIfEncoded } from "../../../../utils/helpers";
import { labMessageSchema } from "../../../../zodSchemas";
import Button from "../../../UserInterfaceComponents/Button";
import Container from "../../../UserInterfaceComponents/Container";

type Props = {
  lab: Lab;
  setLab(args: Lab): void;
};

export default function SaveLabMessage({ lab, setLab }: Props) {
  const [labMessageError, setLabMessageError] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);

  function handleLabMessageChange(newLabMessage: string) {
    let asciiLabMessage = btoa(newLabMessage);
    const validationResult = labMessageSchema.safeParse(asciiLabMessage);
    setLab({
      ...lab,
      message: asciiLabMessage,
    });
    setIsModified(true);
    if (validationResult.success) {
      setLabMessageError("");
    } else {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(" ");
      setLabMessageError(errorMessages);
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      BulletList.configure({
        HTMLAttributes: {
          class: "ml-6 list-disc",
        },
      }),
      Link.configure({
        protocols: ["mailto", "http", "https"],
        HTMLAttributes: {
          class: "text-blue-500 underline hover:cursor-pointer",
        },
        autolink: true,
        openOnClick: false,
        linkOnPaste: true,
      }),
      Heading.configure({
        levels: [4],
        HTMLAttributes: {
          class: "font-bold text-xl",
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: "px-2 bg-slate-300 rounded dark:bg-slate-600",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "p-2 my-2 bg-slate-300 rounded dark:bg-slate-600 w-full break-words whitespace-pre-wrap",
        },
      }),
    ],
    content: decodeIfEncoded(lab.message),
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] h-fit rounded p-2 border border-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700",
      },
    },
    onUpdate: ({ editor }) => {
      handleLabMessageChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (editor === null) {
      return;
    }
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (editor === null) {
    return null;
  }

  return (
    <Container
      collapsible
      title="Message"
      additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
    >
      <div className="flex flex-col space-y-2">
        <span className="mb-2 text-sm italic text-slate-700 dark:text-slate-300">
          End users of readiness labs and challenges will see this message
          instead of the description. Use this to provide additional context or
          instructions. You can use the toolbar below to format the message.
        </span>
        <div className="flex space-x-1">
          <Button
            variant={
              editor.isActive("heading", { level: 4 })
                ? "secondary"
                : "secondary-outline"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            tooltipMessage="Heading"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Heading"
          >
            <FaHeading />
          </Button>
          <Button
            variant={
              editor.isActive("bold") ? "secondary" : "secondary-outline"
            }
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltipMessage="Bold"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Bold"
          >
            <FaBold />
          </Button>
          <Button
            variant={
              editor.isActive("italic") ? "secondary" : "secondary-outline"
            }
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltipMessage="Italic"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Italic"
          >
            <FaItalic />
          </Button>
          <Button
            variant={
              editor.isActive("code") ? "secondary" : "secondary-outline"
            }
            onClick={() => editor.chain().focus().toggleCode().run()}
            tooltipMessage="Inline Code"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Inline Code"
          >
            <FaCode />
          </Button>
          <Button
            variant={
              editor.isActive("codeBlock") ? "secondary" : "secondary-outline"
            }
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            tooltipMessage="Code Block"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Code Block"
          >
            <FaFileCode />
          </Button>
          <Button
            variant={
              editor.isActive("bulletList") ? "secondary" : "secondary-outline"
            }
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltipMessage="Bullet List"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Bullet List"
          >
            <FaListUl />
          </Button>
          <Button
            onClick={setLink}
            variant={
              editor.isActive("link") ? "secondary" : "secondary-outline"
            }
            tooltipMessage="Link"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Link"
          >
            <FaLink />
          </Button>
          <Button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            variant="secondary-outline"
            tooltipMessage="Unlink"
            tooltipDelay={200}
            tooltipDirection="top"
            aria-label="Unlink"
          >
            <FaUnlink />
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>
      {isModified && labMessageError && (
        <div className="rounded border border-rose-500 bg-rose-500 bg-opacity-50 p-2">
          <p className="error-message">{labMessageError}</p>
        </div>
      )}
    </Container>
  );
}

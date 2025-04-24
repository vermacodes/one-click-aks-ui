import { HTMLAttributes, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { cn } from "../../../utils/cn";
import Button from "../Button";

type Props = HTMLAttributes<HTMLDivElement> & {
  id?: string;
  ariaLabel?: string;
  title?: string;
  sticky?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  hoverEffect?: boolean;
  additionalClasses?: string;
  additionalContainerBodyClasses?: string;
  children: React.ReactNode;
};

export default function Container({
  title,
  children,
  sticky = false,
  collapsible = false,
  collapsed = false,
  hoverEffect = true,
  additionalClasses,
  additionalContainerBodyClasses,
  ...rest
}: Props) {
  const [open, setOpen] = useState<boolean>(!collapsed);

  // Function to replace the spaces in the title with underscores
  const formattedTitle = title?.replace(/\s+/g, "_");

  return (
    <div
      id={`container-${formattedTitle}`}
      className={cn(
        "flex w-full flex-col justify-between gap-4 rounded bg-slate-50 p-4 shadow-md outline-1 outline-slate-400 dark:bg-slate-950 dark:outline-slate-600",
        { "sticky top-0 z-20": sticky },
        {
          "hover:shadow-lg hover:outline hover:outline-sky-700 dark:outline-slate-600 dark:hover:outline-sky-500":
            hoverEffect,
        },
        additionalClasses && additionalClasses,
      )}
      {...rest}
    >
      {(title || collapsible) && (
        <div
          className="flex items-center justify-between"
          onClick={() => {
            collapsible && setOpen(!open);
          }}
        >
          {title && <p className="text-lg">{title}</p>}
          {collapsible && (
            <div
              className={cn("transition-transform duration-100", {
                "rotate-180": !open,
              })}
            >
              <Button
                id="togglebutton"
                variant="secondary-icon"
                onClick={() => setOpen(!open)}
                aria-expanded={open} // Indicates the expanded/collapsed state
                aria-label="Toggle container" // Accessible label for the button
                aria-controls={
                  title ? `container-${formattedTitle}` : undefined
                } // Links the button to the container
              >
                <FaChevronUp />
              </Button>
            </div>
          )}
        </div>
      )}
      {open && (
        <div
          key={title}
          className={cn(
            "max-h-fit",
            additionalContainerBodyClasses && additionalContainerBodyClasses,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

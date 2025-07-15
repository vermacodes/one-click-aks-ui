import { FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "../../../components/UserInterfaceComponents/Tooltip";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn"; // Ensure the correct import path for the cn utility

type Props = {
  id: string;
  expanded: string;
  setExpanded: React.Dispatch<React.SetStateAction<string>>;
  childTos?: string[];
  children: React.ReactNode;
};

export default function NavParent({
  id,
  expanded,
  setExpanded,
  children,
  childTos,
}: Props) {
  const location = useLocation();

  const isActive = childTos?.some((childTo) => {
    // If location.pathname includes "challengelab" and id is "learning", ignore this childTo
    if (location.pathname.includes("challengelab") && id === "learning") {
      return false;
    }

    // Otherwise, check if location.pathname starts with childTo
    return location.pathname.startsWith(childTo);
  });

  const activeClass = isActive
    ? getUIStateColors({ selected: true, hover: true, colors: "primary" })
    : getUIStateColors({ hover: true });

  return (
    <Tooltip>
      <Link
        to={"#"}
        className={cn(
          "flex h-full w-full items-center justify-between gap-2 rounded px-4 py-3 text-left text-base",
          activeClass,
          expanded === id &&
            getUIStateColors({
              colors: "secondary",
              hover: true,
              selected: true,
            }),
          isActive && "contrast-more:outline-2",
          isActive && expanded === id && "contrast-more:outline-0",
        )}
        onClick={() => {
          setExpanded(expanded === id ? "" : id);
        }}
      >
        <div className="flex items-center gap-1">{children}</div>
        <div className={cn(expanded === id && "rotate-90", "transition-all")}>
          <FaChevronRight />
        </div>
      </Link>
    </Tooltip>
  );
}

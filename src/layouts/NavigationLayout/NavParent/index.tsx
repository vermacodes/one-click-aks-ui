import { FaChevronRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { getUIStateColors } from "../../../defaults";

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
    <button
      className={`${expanded === id && getUIStateColors({ hover: true, selected: true })} ${activeClass} flex h-full w-full items-center justify-between gap-2 rounded px-4 py-3 text-left text-base`}
      onClick={() => {
        setExpanded(expanded == id ? "" : id);
      }}
    >
      <div className="flex items-center gap-1">{children}</div>
      <div className={`${expanded === id && "rotate-90"} transition-all`}>
        <FaChevronRight />
      </div>
    </button>
  );
}

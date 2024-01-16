import { FaChevronRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";

type Props = {
	id: string;
	expanded: string;
	setExpanded: React.Dispatch<React.SetStateAction<string>>;
	childTos?: string[];
	children: React.ReactNode;
};

export default function NavParent({ id, expanded, setExpanded, children, childTos }: Props) {
	const location = useLocation();

	const isActive = childTos?.some((childTo) => {
		// If location.pathname includes "challengelab" and id is "learning", ignore this childTo
		if (location.pathname.includes("challengelab") && id === "learning") {
			return false;
		}

		// Otherwise, check if location.pathname starts with childTo
		return location.pathname.startsWith(childTo);
	});

	const activeClass = isActive ? "bg-sky-200 dark:bg-sky-800 " : "hover:bg-slate-200 dark:hover:bg-slate-800 ";

	return (
		<button
			className={`${expanded === id && "bg-slate-200 dark:bg-slate-800 "}
        ${activeClass}
        flex h-full w-full items-center justify-between gap-2 rounded px-4 py-3 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800`}
			onClick={() => {
				setExpanded(expanded == id ? "" : id);
			}}
		>
			<div className="flex items-center gap-1">{children}</div>
			<div className={`${expanded === id && "rotate-90 "} transition-all`}>
				<FaChevronRight />
			</div>
		</button>
	);
}

import { Link, useLocation } from "react-router-dom";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type NavItemProps = {
	icon: React.ReactNode;
	label: string;
	to: string;
	toolTipMessage?: string;
	toolTipDelay?: number;
	toolTipDirection?: "top" | "bottom" | "left" | "right";
	depth?: number;
};

export default function NavItem({
	icon,
	label,
	to,
	toolTipMessage,
	toolTipDelay = 500,
	toolTipDirection = "top",
	depth = 0,
}: NavItemProps) {
	const location = useLocation();

	const isActive = location.pathname.includes(to);
	const activeClass = isActive ? "bg-sky-200 dark:bg-sky-800" : "hover:bg-slate-200 dark:hover:bg-slate-800";

	return (
		<li>
			<Link to={to}>
				<Tooltip message={toolTipMessage} delay={toolTipDelay} direction={toolTipDirection}>
					<button
						className={`flex h-full w-full items-center justify-start gap-2 rounded py-3 px-4 text-left text-base ${activeClass}`}
					>
						<div className={`ml-${depth * 4}`}>
							<div className="flex items-center gap-2 text-base">
								<span>{icon}</span>
								<span>{label}</span>
							</div>
						</div>
					</button>
				</Tooltip>
			</Link>
		</li>
	);
}

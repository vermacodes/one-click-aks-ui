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

	/**
	 * Checks if the current location matches the given path.
	 *
	 * @param {string} to - The path to check.
	 * @param {string} location - The current location.
	 * @returns {boolean} - Returns true if the current location matches the given path, false otherwise.
	 */
	function isActivePath(to: string, location: string): boolean {
		// Initialize isActive as false
		let isActive = false;

		// If location.pathname includes "challengelab" and id is "learning", ignore this childTo
		if (label === "My Challenges" && location.startsWith("/labs/challengelab")) {
			return false;
		}

		// If the path includes "labs"
		if (to.includes("labs")) {
			// Replace "labs" with "(labs|lab)" to create a regular expression that matches either "labs" or "lab"
			const regex = new RegExp(to.replace("labs", "(labs|lab)"));
			// Check if the current location matches the regular expression
			isActive = regex.test(location);
		} else {
			// If the path does not include "labs", check if the current location starts with the path
			isActive = location.startsWith(to);
		}
		// Return the result
		return isActive;
	}

	const activeClass = isActivePath(to, location.pathname)
		? "bg-sky-200 dark:bg-sky-800"
		: "hover:bg-slate-200 dark:hover:bg-slate-800";

	return (
		<li>
			<Link to={to}>
				<Tooltip message={toolTipMessage} delay={toolTipDelay} direction={toolTipDirection}>
					<button
						className={`flex h-full w-full items-center justify-start gap-2 rounded px-4 py-3 text-left text-base ${activeClass}`}
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

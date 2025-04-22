import { BsArrowUpRight } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import Tooltip from "../../../components/UserInterfaceComponents/Tooltip";
import { getUIStateColors } from "../../../defaults";

type NavItemProps = {
  icon?: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  to: string;
  externalLink?: boolean;
  toolTipMessage?: string;
  toolTipDelay?: number;
  toolTipDirection?: "top" | "bottom" | "left" | "right";
  depth?: number;
};

export default function NavItem({
  icon,
  label,
  children,
  to,
  externalLink = false,
  toolTipMessage,
  toolTipDelay = 500,
  toolTipDirection = "top",
  depth = 0,
}: NavItemProps) {
  const location = useLocation();
  const { navbarOpen, setNavbarOpen, viewportWidth } = useGlobalStateContext();

  /**
   * If the nabBar is open full screen, then we need to close
   * it when the user clicks on a link
   */
  const handleLinkClick = () => {
    const navbar = document.getElementById("navbar");
    if (navbarOpen && viewportWidth < 768) {
      setNavbarOpen(false);
    }
  };

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
    if (
      label === "My Challenges" &&
      location.startsWith("/labs/challengelab")
    ) {
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
    ? getUIStateColors({ selected: true, hover: true, colors: "primary" })
    : getUIStateColors({ hover: true });

  return (
    <li>
      <Tooltip
        message={toolTipMessage}
        delay={toolTipDelay}
        direction={toolTipDirection}
      >
        <Link
          to={to}
          target={`${externalLink ? "_blank" : "_self"}`}
          className={`flex h-full w-full items-center justify-start gap-2 rounded-sm px-4 py-3 text-left text-base ${activeClass}`}
          onClick={handleLinkClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              // Prevent default scrolling behavior for Space
              e.preventDefault();
              handleLinkClick();
            }
            if (e.key === "Escape") {
              // Close the navbar if the Escape key is pressed
              const navbar = document.getElementById("navbar");
              handleLinkClick();
            }
          }}
        >
          <div className={`ml-${depth * 4}`}>
            <div className="flex items-center gap-2 text-base">
              {icon && <span>{icon}</span>}
              <span>{children || label}</span>
              {externalLink && (
                <span>
                  <BsArrowUpRight />
                </span>
              )}
            </div>
          </div>
        </Link>
      </Tooltip>
    </li>
  );
}

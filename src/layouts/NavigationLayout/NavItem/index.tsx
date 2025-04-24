import { BsArrowUpRight } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { navbarOpen, setNavbarOpen, viewportWidth } = useGlobalStateContext();

  const handleLinkClick = () => {
    if (navbarOpen && viewportWidth < 1280) {
      setNavbarOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent default scrolling behavior for Space
      if (externalLink) {
        window.open(to, "_blank");
      } else {
        navigate(to); // Programmatically navigate to the `to` path
      }
      handleLinkClick();
    }
  };

  const isActivePath = (to: string, location: string): boolean => {
    let isActive = false;

    if (
      label === "My Challenges" &&
      location.startsWith("/labs/challengelab")
    ) {
      return false;
    }

    if (to.includes("labs")) {
      const regex = new RegExp(to.replace("labs", "(labs|lab)"));
      isActive = regex.test(location);
    } else {
      isActive = location.startsWith(to);
    }

    return isActive;
  };

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
          className={`m-[1px] flex h-full w-full items-center justify-start gap-2 rounded-sm px-4 py-3 text-left text-base ${activeClass}`}
          onClick={handleLinkClick}
          onKeyDown={handleKeyDown} // Use the new handler
          tabIndex={0}
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

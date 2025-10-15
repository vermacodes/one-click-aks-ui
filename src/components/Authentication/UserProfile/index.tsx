import { FaUserNinja } from "react-icons/fa";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
import { useAuth } from "../../../context/AuthContext";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  showName?: boolean;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
};

export default function UserProfile({ 
  showName = true, 
  size = "medium",
  interactive = false 
}: Props) {
  const { graphResponse, profilePhoto } = useAuth();

  // Don't render anything if user is not authenticated
  if (!graphResponse) {
    return null;
  }

  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-10 w-10"
  };

  const Component = interactive ? "button" : "div";

  return (
    <Component
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-left",
        interactive && getUIStateColors({ hover: true }),
        interactive && "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      )}
      {...(interactive && { 
        type: "button",
        "aria-label": `User profile: ${graphResponse.displayName}`
      })}
    >
      <Tooltip
        message={graphResponse.displayName || "User"}
        delay={500}
        direction="bottom"
        align="end"
      >
        <div className={cn("flex-shrink-0", sizeClasses[size])}>
          {profilePhoto ? (
            <img
              className={cn("rounded-full object-cover", sizeClasses[size])}
              src={profilePhoto}
              alt={`${graphResponse.displayName}'s profile picture`}
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <FaUserNinja 
            className={cn(
              "text-gray-500 dark:text-gray-400",
              sizeClasses[size],
              profilePhoto && "hidden"
            )}
          />
        </div>
      </Tooltip>
      
      {showName && graphResponse.displayName && (
        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {graphResponse.displayName}
        </span>
      )}
    </Component>
  );
}

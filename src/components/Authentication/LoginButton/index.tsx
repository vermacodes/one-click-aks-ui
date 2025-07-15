import { FaUserNinja } from "react-icons/fa";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
import { useAuth } from "../../Context/AuthContext";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  showName?: boolean;
};

export default function LoginButton({ showName = true }: Props) {
  const { graphResponse, profilePhoto } = useAuth();

  return graphResponse ? (
    <div>
      <a
        className={cn(
          "justify-star flex h-full w-full items-center gap-2 rounded-sm px-4 py-3 text-left text-base",
          showName && getUIStateColors({ hover: true }), // Evaluate the function first
        )}
      >
        <Tooltip
          message={graphResponse.displayName}
          delay={500}
          direction="bottom"
          align="end"
        >
          <span>
            {profilePhoto === "" ? (
              <FaUserNinja />
            ) : (
              <img
                className="h-6 w-6 rounded-full lg:h-8 lg:w-8"
                src={profilePhoto}
                alt="Profile Picture"
              />
            )}
          </span>
        </Tooltip>
        {showName && <span>{graphResponse.displayName}</span>}
      </a>
    </div>
  ) : null;
}

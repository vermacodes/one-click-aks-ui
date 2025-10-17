import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { TbFidgetSpinner } from "react-icons/tb";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { DeploymentType } from "../../../dataStructures";
import { defaultUIPrimaryTextColor } from "../../../defaults";
import { cn } from "../../../utils/cn";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  deployment: DeploymentType;
};

export default function DeploymentStatus({ deployment }: Props) {
  const { actionStatus } = useWebSocketContext();
  const [showUnknownStatus, setShowUnknownStatus] = useState(false);

  // Reset the timer when actionStatus.inProgress changes
  useEffect(() => {
    if (actionStatus.inProgress) {
      setShowUnknownStatus(false);
      return;
    }

    // Only start the timer if we're in a progress state and action is not in progress
    if (
      deployment.deploymentStatus === "Deployment In Progress" ||
      deployment.deploymentStatus === "Destroy In Progress"
    ) {
      const timer = setTimeout(() => {
        setShowUnknownStatus(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [actionStatus.inProgress, deployment.deploymentStatus]);

  if (
    deployment.deploymentStatus === "Deployment In Progress" ||
    deployment.deploymentStatus === "Destroy In Progress"
  ) {
    if (!actionStatus.inProgress && showUnknownStatus) {
      return (
        <Tooltip
          message={`Can not accurately determine the deployment status. If you see no logs flowing, try repeating the last action manually or re-deploy your server.`}
        >
          <div className={`flex items-center gap-2`}>
            <FaCircleExclamation
              className={"text-amber-700 dark:text-amber-400"}
            />
            Deployment Status Unknown
          </div>
        </Tooltip>
      );
    }
    return (
      <div className={`flex items-center gap-2`}>
        <TbFidgetSpinner
          className={cn("animate-spin text-xl", defaultUIPrimaryTextColor)}
        />
        {deployment.deploymentStatus}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2`}>
      {deployment.deploymentStatus === "Deployment Failed" ||
      deployment.deploymentStatus === "Destroy Failed" ? (
        <p className="text-rose-700 dark:text-rose-400">
          <FaExclamationCircle />
        </p>
      ) : (
        <p className="text-green-700 dark:text-green-400">
          <FaCheckCircle />
        </p>
      )}
      {deployment.deploymentStatus}
    </div>
  );
}

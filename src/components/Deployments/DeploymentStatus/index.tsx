import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { TbFidgetSpinner } from "react-icons/tb";
import { DeploymentType } from "../../../dataStructures";
import { defaultUIPrimaryTextColor } from "../../../defaults";
import { cn } from "../../../utils/cn";
import { useWebSocketContext } from "../../Context/WebSocketContext";
import Tooltip from "../../UserInterfaceComponents/Tooltip";

type Props = {
  deployment: DeploymentType;
};

export default function DeploymentStatus({ deployment }: Props) {
  const { actionStatus } = useWebSocketContext();

  if (
    deployment.deploymentStatus === "Deployment In Progress" ||
    deployment.deploymentStatus === "Destroy In Progress"
  ) {
    if (!actionStatus.inProgress) {
      return (
        <Tooltip
          message={`Can not accurately determine the deployment status. If you see no logs flowing, try repeating the last action manually or re-deploy your server.`}
        >
          <div className={`flex items-center gap-2`}>
            <FaCircleExclamation className="text-amber-500" />
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
        <p className="text-rose-500">
          <FaExclamationCircle />
        </p>
      ) : (
        <p className="text-green-500">
          <FaCheckCircle />
        </p>
      )}
      {deployment.deploymentStatus}
    </div>
  );
}

import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { TbFidgetSpinner } from "react-icons/tb";
import { DeploymentType } from "../../../dataStructures";

type Props = {
	deployment: DeploymentType;
};

export default function DeploymentStatus({ deployment }: Props) {
	if (
		deployment.deploymentStatus === "Deployment In Progress" ||
		deployment.deploymentStatus === "Destroy In Progress"
	) {
		return (
			<div className={`flex items-center gap-2`}>
				<TbFidgetSpinner className="animate-spin text-xl text-sky-500" />
				{deployment.deploymentStatus}
			</div>
		);
	}

	return (
		<div className={`flex items-center gap-2`}>
			{deployment.deploymentStatus === "Deployment Failed" || deployment.deploymentStatus === "Destroy Failed" ? (
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

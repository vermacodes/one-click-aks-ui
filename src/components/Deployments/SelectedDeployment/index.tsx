import { useEffect, useState } from "react";
import { FaBinoculars } from "react-icons/fa";
import { SiTerraform } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { DeploymentType } from "../../../dataStructures";
import { useGetMyDeployments } from "../../../hooks/useDeployments";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { useWebSocketContext } from "../../Context/WebSocketContext";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";
import AutoDestroySwitch from "../AutoDestroySwitch";
import BreakBlobLease from "../BreakBlobLease";
import DeploymentLifespan from "../DeploymentLifespan";
import DeploymentStatus from "../DeploymentStatus";
import DestroyTime from "../DestroyTime";

type Props = {
	sticky?: boolean;
};

export default function SelectedDeployment({ sticky = true }: Props) {
	const { data: deployments } = useGetMyDeployments();
	const { selectedDeployment } = useSelectedDeployment();
	const [selectedDeploymentState, setSelectedDeploymentState] = useState<DeploymentType | undefined>(undefined);

	const { actionStatus } = useWebSocketContext();

	const navigate = useNavigate();

	useEffect(() => {
		if (selectedDeployment !== undefined) {
			setSelectedDeploymentState(selectedDeployment);
		} else if (deployments !== undefined) {
			setSelectedDeploymentState(deployments.filter((deployment) => deployment.deploymentWorkspace === "default")[0]);
		}
	}, [selectedDeployment, deployments]);

	if (selectedDeploymentState === undefined) {
		return <></>;
	}

	return (
		<Container sticky={sticky} additionalClasses="mb-4 py-2 text-base">
			<div
				className="flex justify-between gap-2 text-sm hover:cursor-pointer"
				key={selectedDeploymentState.deploymentId}
				onClick={() => navigate(`/deployments`)}
			>
				<div className="flex items-center gap-x-2">
					<SiTerraform className="text-xl" />
					<h1 className="text-xl text-sky-500">{selectedDeploymentState.deploymentWorkspace}</h1>
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2">
					<DeploymentStatus deployment={selectedDeploymentState} />
					<div
						className="flex flex-wrap items-center justify-end gap-2 hover:cursor-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mx-2 h-6 border-r border-gray-300"></div>
						<AutoDestroySwitch
							deployment={selectedDeploymentState}
							disabled={actionStatus.inProgress}
							label="Auto Destroy"
							key={selectedDeploymentState.deploymentId}
						/>
						<DeploymentLifespan deployment={selectedDeploymentState} />
						<DestroyTime deployment={selectedDeploymentState} />
						<div className="mx-2 h-6 border-r border-gray-300"></div>
						<BreakBlobLease deployment={selectedDeploymentState} buttonVariant="secondary-text" />
						<Link to={"/deployments"} tabIndex={-1}>
							<Button
								variant="secondary-text"
								tooltipMessage="View and manage all deployments"
								tooltipDelay={200}
								tooltipAlign="end"
							>
								<FaBinoculars /> View All
							</Button>
						</Link>
					</div>
					{/* <CreateNewDeployment variant="primary-text" tooltipMessage="Add new deployment" tooltipDelay={200}>
            <FaPlus /> Add
          </CreateNewDeployment> */}
				</div>
			</div>
		</Container>
	);
}

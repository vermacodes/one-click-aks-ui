import { useEffect } from "react";
import { FaPlus, FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";
import CreateNewDeployment from "../../components/Deployments/CreateNewDeployment";
import Deployment from "../../components/Deployments/Deployment";
import Terminal from "../../components/Terminal/Terminal";
import BackButton from "../../components/UserInterfaceComponents/BackButton";
import Button from "../../components/UserInterfaceComponents/Button";
import { DeploymentType } from "../../dataStructures";
import { useGetMyDeployments } from "../../hooks/useDeployments";
import { useSelectedDeployment } from "../../hooks/useSelectedDeployment";
import { useServerStatus } from "../../hooks/useServerStatus";
import { useTerraformWorkspace } from "../../hooks/useWorkspace";
import PageLayout from "../../layouts/PageLayout";
import ServerError from "../ServerError";

export default function Deployments() {
	const { data: deployments } = useGetMyDeployments();
	const { data: workspaces } = useTerraformWorkspace();
	const { data: serverStatus } = useServerStatus();
	const { selectedDeployment } = useSelectedDeployment();

	useEffect(() => {
		document.title = "ACT Labs | Deployments";
	}, []);

	if (serverStatus?.status !== "OK") {
		return <ServerError />;
	}

	if (deployments === undefined || workspaces === undefined) {
		return (
			<PageLayout heading="Deployments">
				<p className="text-4xl">Loading...</p>
			</PageLayout>
		);
	}

	return (
		<PageLayout heading="Deployments">
			<div className="flex items-center justify-between">
				<BackButton />

				<div className={`mb-3 flex justify-end gap-x-2 rounded`}>
					<Link to="/builder">
						<Button variant="secondary-outline">
							<FaTools /> Lab Builder
						</Button>
					</Link>
					<CreateNewDeployment variant="primary">
						<FaPlus /> Add Deployment
					</CreateNewDeployment>
					<Button variant="secondary">Test Button</Button>
				</div>
			</div>
			{deployments &&
				deployments.length > 0 &&
				deployments.map((deployment: DeploymentType) => (
					<Deployment deployment={deployment} selectedDeployment={selectedDeployment} key={deployment.deploymentId} />
				))}
			<Terminal />
		</PageLayout>
	);
}

import { useEffect } from "react";
import ActlabsHubEndpoint from "../../components/Config/ActlabsHubEndpoint";
import AzureRegion from "../../components/Config/AzureRegion";
import AzureSubscriptionSetting from "../../components/Config/AzureSubscriptionSetting";
import ResetActionStatus from "../../components/Config/ResetActionStatus";
import ResetServerCache from "../../components/Config/ResetServerCache";
import ServerConfig from "../../components/Config/Server/ServerConfig";
import TerraformInit from "../../components/Config/TerraformInit";
import TerraformWorkspaces from "../../components/Config/TerraformWorkspaces";
import Container from "../../components/UserInterfaceComponents/Container";
import PageLayout from "../../layouts/PageLayout";

export default function Settings() {
	useEffect(() => {
		document.title = "ACT Labs | Settings";
	}, []);

	return (
		<PageLayout heading="Settings">
			<div className="mb-4 flex flex-col gap-4">
				<ServerConfig />
				{/* <ServerStatus />
        <ManagedServer />
        <ServerEndpoint /> */}
				{/* <WebSocketEndpoint /> */}
				<ActlabsHubEndpoint />
				{/* <StorageAccount /> */}
				<AzureSubscriptionSetting />
				<AzureRegion />

				<TerraformInit />
				<TerraformWorkspaces />
				<Container collapsible={true}>
					<div className="flex flex-col md:flex-row">
						<ResetActionStatus />
						<ResetServerCache />
					</div>
				</Container>
			</div>
		</PageLayout>
	);
}

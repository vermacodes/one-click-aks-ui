import ActlabsHubEndpoint from "../ActlabsHubEndpoint";
import NoSubscriptionsFound from "../NoSubscriptionsFound";
import SelectedTerraformWorkspaceNotFound from "../SelectedTerraformWorkspaceNotFound";
import ServerNotConnected from "../ServerNotConnected";
import VersionCheck from "../VersionCheck";
import WebSocketConnectionStatus from "../WebSocketConnectionStatus";

export default function Detectors() {
  return (
    <>
      {/* <CustomMessage /> */}
      <ServerNotConnected />
      <VersionCheck />
      <WebSocketConnectionStatus />
      <NoSubscriptionsFound />
      <SelectedTerraformWorkspaceNotFound />
      <ActlabsHubEndpoint />
    </>
  );
}

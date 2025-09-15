import ActlabsHubEndpoint from "../ActlabsHubEndpoint";
import NoSubscriptionsFound from "../NoSubscriptionsFound";
import NewSubscriptionNotSupported from "../ProdSubscriptionsNotSupported";
import SelectedTerraformWorkspaceNotFound from "../SelectedTerraformWorkspaceNotFound";
import ServerNotConnected from "../ServerNotConnected";
import VersionCheck from "../VersionCheck";
import WebSocketConnectionStatus from "../WebSocketConnectionStatus";

export default function Detectors() {
  return (
    <>
      {/* <CustomMessage /> */}
      <NewSubscriptionNotSupported />
      <ServerNotConnected />
      <VersionCheck />
      <WebSocketConnectionStatus />
      <NoSubscriptionsFound />
      <SelectedTerraformWorkspaceNotFound />
      <ActlabsHubEndpoint />
    </>
  );
}

import NoSubscriptionsFound from "../NoSubscriptionsFound";
import SelectedTerraformWorkspaceNotFound from "../SelectedTerraformWorkspaceNotFound";
import ServerNotConnected from "../ServerNotConnected";
import StorageAccountNotConfigured from "../StorageAccountNotConfigured";
import VersionCheck from "../VersionCheck";
import WebSocketConnectionStatus from "../WebSocketConnectionStatus";

export default function Detectors() {
  return (
    <>
      <ServerNotConnected />
      <VersionCheck />
      <WebSocketConnectionStatus />
      <NoSubscriptionsFound />
      <StorageAccountNotConfigured />
      <SelectedTerraformWorkspaceNotFound />
    </>
  );
}

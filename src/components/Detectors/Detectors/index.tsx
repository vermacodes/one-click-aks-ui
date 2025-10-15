import { Component, ReactNode } from "react";
import ActlabsHubEndpoint from "../ActlabsHubEndpoint";
import HubNotConnected from "../HubNotConnected";
import NoSubscriptionsFound from "../NoSubscriptionsFound";
import SelectedTerraformWorkspaceNotFound from "../SelectedTerraformWorkspaceNotFound";
import ServerNotConnected from "../ServerNotConnected";
import VersionCheck from "../VersionCheck";
import WebSocketConnectionStatus from "../WebSocketConnectionStatus";

// Simple error boundary component
class DetectorErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Detector Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently to avoid breaking the entire UI
    }

    return this.props.children;
  }
}

// Wrapper for each detector with error boundary
function SafeDetector({ children }: { children: ReactNode }) {
  return <DetectorErrorBoundary>{children}</DetectorErrorBoundary>;
}

export default function Detectors() {
  return (
    <div className="detector-container">
      {/* Critical alerts first */}
      <SafeDetector>
        <HubNotConnected />
      </SafeDetector>

      <SafeDetector>
        <ServerNotConnected />
      </SafeDetector>

      <SafeDetector>
        <VersionCheck />
      </SafeDetector>

      {/* Connection status alerts */}
      <SafeDetector>
        <WebSocketConnectionStatus />
      </SafeDetector>

      {/* Data loading alerts */}
      <SafeDetector>
        <NoSubscriptionsFound />
      </SafeDetector>

      <SafeDetector>
        <SelectedTerraformWorkspaceNotFound />
      </SafeDetector>

      {/* Configuration alerts */}
      <SafeDetector>
        <ActlabsHubEndpoint />
      </SafeDetector>
    </div>
  );
}

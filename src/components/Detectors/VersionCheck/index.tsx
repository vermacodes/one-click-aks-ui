import { Link } from "react-router-dom";
import { defaultLinkTextStyle } from "../../../defaults";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

// Configuration for version requirements
const VERSION_CONFIG = {
  MINIMUM_REQUIRED_VERSION: "20240617",
  VERSION_DATE_FORMAT: "YYYYMMDD", // For documentation
} as const;

export default function VersionCheck() {
  const { data: serverStatus, isFetching, isError } = useServerStatus();

  /**
   * Check if the server version meets the minimum requirements
   * @param version - Version string from server (format: YYYYMMDD)
   * @returns true if version is sufficient, false otherwise
   */
  const isVersionSupported = (version: string): boolean => {
    if (!version || version.trim() === "") {
      return false;
    }

    try {
      // Parse version as integer for date-based comparison
      const versionNumber = parseInt(version.trim(), 10);
      const minVersionNumber = parseInt(
        VERSION_CONFIG.MINIMUM_REQUIRED_VERSION,
        10,
      );

      // Validate that the version is a reasonable date (basic sanity check)
      if (
        isNaN(versionNumber) ||
        versionNumber < 20200101 ||
        versionNumber > 30000101
      ) {
        console.warn(`Invalid version format received: ${version}`);
        return false;
      }

      return versionNumber >= minVersionNumber;
    } catch (error) {
      console.error("Error parsing version:", error);
      return false;
    }
  };

  // Don't render anything while loading or if no data
  if (!serverStatus || isFetching) {
    return null;
  }

  // Don't show version warning if server is not reachable
  if (isError || serverStatus.status !== "OK") {
    return null;
  }

  // Don't show warning if version is supported
  if (isVersionSupported(serverStatus.version)) {
    return null;
  }

  return (
    <Alert variant="warning">
      <div className="flex flex-col gap-2">
        <div>
          <strong>⚠️ Server Update Required:</strong> Your server version (
          {serverStatus.version}) is outdated. Please update to version{" "}
          {VERSION_CONFIG.MINIMUM_REQUIRED_VERSION} or later.
        </div>
        <div className="text-sm">
          Go to{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>{" "}
          and follow the deployment steps to update your server.
        </div>
      </div>
    </Alert>
  );
}

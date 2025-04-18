import { Link } from "react-router-dom";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ActlabsHubEndpoint() {
  // set default values in local storage
  let actlabsHubBaseUrl = localStorage.getItem("actlabsHubBaseUrl");
  if (
    actlabsHubBaseUrl === null ||
    actlabsHubBaseUrl ===
      "https://actlabs-hub-capp.redisland-ff4b63ab.eastus.azurecontainerapps.io"
  ) {
    localStorage.setItem(
      "actlabsHubBaseUrl",
      "https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/"
    );
    actlabsHubBaseUrl = localStorage.getItem("actlabsHubBaseUrl");
  }

  if (
    actlabsHubBaseUrl?.includes("actlabs-hub-capp.purplegrass") ||
    actlabsHubBaseUrl?.includes("localhost") ||
    actlabsHubBaseUrl?.includes("actlabs-hub-capp.salmonmeadow")
  ) {
    return <></>;
  }

  return (
    <Alert variant="warning">
      <strong>⚠️ ActLabs Hub Base URL Incorrect:</strong> Goto{" "}
      <Link
        to="/settings"
        className="cursor-pointer text-sky-800 underline dark:text-sky-400"
      >
        Settings
      </Link>
      , and change it to
      https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/.
    </Alert>
  );
}

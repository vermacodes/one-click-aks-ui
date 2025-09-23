import { Link } from "react-router-dom";
import { defaultLinkTextStyle } from "../../../defaults";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ActlabsHubEndpoint() {
  // set default values in local storage
  let actlabsHubBaseUrl = localStorage.getItem("actlabsHubBaseUrl");
  if (
    actlabsHubBaseUrl === null ||
    actlabsHubBaseUrl ===
      "https://actlabs-hub-capp.redisland-ff4b63ab.eastus.azurecontainerapps.io" ||
    actlabsHubBaseUrl ===
      "https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/"
  ) {
    localStorage.setItem(
      "actlabsHubBaseUrl",
      "https://app.msftactlabs.com/hub/",
    );
    actlabsHubBaseUrl = localStorage.getItem("actlabsHubBaseUrl");
  }

  if (
    actlabsHubBaseUrl?.includes("localhost") ||
    actlabsHubBaseUrl?.includes("msftactlabs.com")
  ) {
    return <></>;
  }

  return (
    <Alert variant="warning">
      <strong>⚠️ ActLabs Hub Base URL Incorrect:</strong> Goto{" "}
      <Link to="/settings" className={defaultLinkTextStyle}>
        Settings
      </Link>
      , and change it to https://app.msftactlabs.com/hub/.
    </Alert>
  );
}

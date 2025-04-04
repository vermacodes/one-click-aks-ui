import { Link } from "react-router-dom";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ActlabsHubEndpoint() {
	// set default values in local storage
	if (
		localStorage.getItem("actlabsHubBaseUrl") === null ||
		localStorage.getItem("actlabsHubBaseUrl") ===
			"https://actlabs-hub-capp.redisland-ff4b63ab.eastus.azurecontainerapps.io"
	) {
		localStorage.setItem(
			"actlabsHubBaseUrl",
			"https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/"
		);
	}

	if (
		localStorage.getItem("actlabsHubBaseUrl")?.includes("actlabs-hub-capp.purplegrass") ||
		localStorage.getItem("actlabsHubBaseUrl")?.includes("localhost") ||
		localStorage.getItem("actlabsHubBaseUrl")?.includes("actlabs-hub-capp.salmonmeadow")
	) {
		return <></>;
	}

	return (
		<Alert variant="warning">
			<strong>⚠️ ActLabs Hub Base URL Incorrect:</strong> Goto{" "}
			<Link to="/settings" className="cursor-pointer text-sky-600 underline">
				Settings
			</Link>
			, and change it to https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/.
		</Alert>
	);
}

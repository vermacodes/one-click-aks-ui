import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useServerStatus } from "../../../hooks/useServerStatus";
import { useTerraformWorkspace } from "../../../hooks/useWorkspace";

export default function SelectedTerraformWorkspaceNotFound() {
	const [showError, setShowError] = useState(() => {
		const savedShowError = sessionStorage.getItem("show-terraform-workspace-fetch-error");
		return savedShowError ? JSON.parse(savedShowError) : false;
	});

	const { data: serverStatus, isError: serverError } = useServerStatus();
	const { data: terraformWorkspaces, isError, isFetching, isLoading } = useTerraformWorkspace();

	useEffect(() => {
		if (terraformWorkspaces && terraformWorkspaces.length > 0) {
			setShowError(false);
		}

		if (isError && serverStatus?.status === "OK") {
			setTimeout(() => {
				setShowError(true);
			}, 10000);
		}
	}, [terraformWorkspaces, isError]);

	useEffect(() => {
		sessionStorage.setItem("show-terraform-workspace-fetch-error", JSON.stringify(showError));
	}, [showError]);

	if (serverStatus?.status !== "OK" || serverError || terraformWorkspaces) {
		return null;
	}

	if (showError) {
		return (
			<div className="z-5 mt-2 rounded border border-rose-500 bg-rose-500 bg-opacity-20 p-2">
				<strong>🛑 Terraform Error:</strong> Unable to fetch terraform workspaces. Try 'Reset Server Cache' from{" "}
				<Link to={"/settings"} className="text-sky-500 underline">
					settings
				</Link>{" "}
				or redeploy server.
			</div>
		);
	}

	if (isFetching || isLoading) {
		return (
			<div className="z-5 mt-2 rounded border border-sky-500 bg-sky-500 bg-opacity-20 p-2">
				<strong>ℹ️ Fetching Terraform Workspace:</strong> Terraform operations will not work at this time. This is
				normal if server just started or you just reset cache. Please wait...
			</div>
		);
	}

	return null;
}

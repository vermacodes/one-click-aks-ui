import { useEffect, useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useServerStatus } from "../../../hooks/useServerStatus";
import { useTerraformWorkspace } from "../../../hooks/useWorkspace";
import Alert from "../../UserInterfaceComponents/Alert";

export default function SelectedTerraformWorkspaceNotFound() {
  const [showError, setShowError] = useState(() => {
    const savedShowError = sessionStorage.getItem(
      "show-terraform-workspace-fetch-error"
    );
    return savedShowError ? JSON.parse(savedShowError) : false;
  });

  const { data: serverStatus, isError: serverError } = useServerStatus();
  const {
    data: terraformWorkspaces,
    isError,
    isFetching,
    isLoading,
  } = useTerraformWorkspace();

  useEffect(() => {
    if (terraformWorkspaces && terraformWorkspaces.length > 0) {
      setShowError(false);
    }

    if (isError && serverStatus?.status === "OK") {
      setTimeout(() => {
        setShowError(true);
      }, 120000);
    }
  }, [terraformWorkspaces, isError]);

  useEffect(() => {
    sessionStorage.setItem(
      "show-terraform-workspace-fetch-error",
      JSON.stringify(showError)
    );
  }, [showError]);

  if (serverStatus?.status !== "OK" || serverError || terraformWorkspaces) {
    return null;
  }

  if (showError) {
    return (
      <Alert variant="danger">
        <strong>🛑 Terraform Error:</strong> Unable to fetch terraform
        workspaces. Try 'Reset Server Cache' from{" "}
        <Link
          to={"/settings"}
          className="text-sky-700 underline dark:text-sky-500"
        >
          settings
        </Link>{" "}
        or redeploy server.
      </Alert>
    );
  }

  if (isFetching || isLoading) {
    return (
      <Alert variant="info">
        <div className="flex items-center gap-2">
          <TbFidgetSpinner className="animate-spin" />
          <strong>Initializing Terraform:</strong> Terraform operations will not
          work at this time. Please wait...
        </div>
      </Alert>
    );
  }

  return null;
}

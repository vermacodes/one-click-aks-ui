import { useEffect, useState } from "react";
import { useGetSelectedTerraformWorkspace } from "../../../hooks/useGetSelectedTerraformWorkspace";
import { useServerStatus } from "../../../hooks/useServerStatus";

export default function SelectedTerraformWorkspaceNotFound() {
  const { data: serverStatus, isError } = useServerStatus();
  const { selectedTerraformWorkspace } = useGetSelectedTerraformWorkspace();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowMessage(true);
    }, 30000); // 30 seconds delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (selectedTerraformWorkspace !== undefined || isError || serverStatus?.status !== "OK" || !showMessage) {
    return null;
  }

  return (
    <div className="z-5 mt-2 rounded border border-yellow-500 bg-yellow-500 bg-opacity-20 p-2">
      <strong>⚠️ No Terraform Workspace Selected:</strong> This is normal if server just started or you just reset
      cache. If this persists, you may have to 'Reset Server Cache' from settings or re-deploy your server.
    </div>
  );
}

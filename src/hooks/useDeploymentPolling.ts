import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useManagedServer } from "./useManagedServer";
import { useServerHostingSync } from "./useServerHostingSync";

export function useDeploymentPolling() {
  const { data: managedServer } = useManagedServer();
  const { serverHosting } = useServerHostingSync();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (managedServer === undefined || serverHosting.environment !== "azure") {
      return;
    }

    if (managedServer.status === "Deploying") {
      const intervalId = setInterval(() => {
        if (
          managedServer !== undefined &&
          serverHosting.environment === "azure"
        ) {
          queryClient.invalidateQueries("get-managed-server");
          queryClient.invalidateQueries("server-status");
        }
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [managedServer, serverHosting, queryClient]);
}

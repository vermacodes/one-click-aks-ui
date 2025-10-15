import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useInterval from "./useInterval";
import {
  useManagedServer,
  useManagedServerActivityUpdate,
} from "./useManagedServer";
import { usePageVisibility } from "./usePageVisibility";
import { useServerHostingSync } from "./useServerHostingSync";

function getServerHostingFromLocalStorage() {
  const serverHostingFromLocalStorageString =
    localStorage.getItem("serverHosting") || "{}";
  return JSON.parse(serverHostingFromLocalStorageString);
}

export function useActivityMonitoring() {
  const isPageVisible = usePageVisibility();
  const { serverHosting } = useServerHostingSync();
  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();
  const queryClient = useQueryClient();

  // Handle page visibility changes
  useEffect(() => {
    if (isPageVisible) {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");

      if (
        managedServer !== undefined &&
        serverHosting.environment === "azure"
      ) {
        updateActivity(managedServer.userPrincipalName);
      }
    }
  }, [
    isPageVisible,
    serverHosting,
    managedServer,
    updateActivity,
    queryClient,
  ]);

  // Periodic activity updates
  useInterval(() => {
    const serverHostingFromLocalStorage = getServerHostingFromLocalStorage();

    if (
      !isPageVisible ||
      managedServer === undefined ||
      serverHostingFromLocalStorage.environment !== "azure"
    ) {
      return;
    }
    updateActivity(managedServer.userPrincipalName);
  }, 60000);
}

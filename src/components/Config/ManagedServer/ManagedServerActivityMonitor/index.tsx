import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useDeployManagedServer } from "../../../../hooks/useDeployManagedServer";
import useInterval from "../../../../hooks/useInterval";
import { useManagedServer, useManagedServerActivityUpdate } from "../../../../hooks/useManagedServer";

export default function ManagedServerActivityMonitor() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);

  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();

  const { handleDeploy } = useDeployManagedServer();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isPageVisible) {
      queryClient.invalidateQueries("get-managed-server");
    }
  }, [isPageVisible]);

  useEffect(() => {
    if (managedServer === undefined) {
      return;
    }

    // if managed server was auto destroyed and the page is visible, auto create a new one
    if (managedServer.status === "AutoDestroyed" && isPageVisible && managedServer.autoCreate) {
      setTimeout(() => {
        if (isPageVisible) {
          handleDeploy(managedServer);
        }
      }, 10000); // 10 seconds delay
    }
  }, [managedServer]);

  useEffect(() => {
    function handleVisibilityChange() {
      setPageVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useInterval(() => {
    if (!isPageVisible || managedServer === undefined) {
      return;
    }
    updateActivity(managedServer.userPrincipalName);
  }, 60000);

  return null;
}

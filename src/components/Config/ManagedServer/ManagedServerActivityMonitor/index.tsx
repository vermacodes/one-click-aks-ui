import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useDeployManagedServer } from "../../../../hooks/useDeployManagedServer";
import useInterval from "../../../../hooks/useInterval";
import { useManagedServer, useManagedServerActivityUpdate } from "../../../../hooks/useManagedServer";

export default function ManagedServerActivityMonitor() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);
  const isPageVisibleRef = useRef(isPageVisible);

  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();

  const { handleDeploy } = useDeployManagedServer();
  const queryClient = useQueryClient();

  /**
   * runs when the page visibility changes.
   * It invalidates the "get-managed-server" query in the query client
   * and updates the activity for the managed server if it is defined.
   *
   */
  useEffect(() => {
    if (isPageVisible) {
      queryClient.invalidateQueries("get-managed-server");
      if (managedServer !== undefined) {
        updateActivity(managedServer.userPrincipalName);
      }
    }

    isPageVisibleRef.current = isPageVisible;
  }, [isPageVisible]);

  /**
   * handles auto creation of a new managed server if the previous one was auto destroyed.
   */
  useEffect(() => {
    if (managedServer === undefined) {
      return;
    }

    // if managed server was auto destroyed and the page is visible, auto create a new one
    if (managedServer.status === "AutoDestroyed" && isPageVisible && managedServer.autoCreate) {
      // wait for 10 seconds before creating a new managed server
      setTimeout(() => {
        if (isPageVisibleRef.current) {
          console.log("Auto creating a new managed server.");
          handleDeploy(managedServer);
        }
      }, 10000); // 10 seconds delay
    }
  }, [managedServer]);

  /**
   * Sets up an event listener to track the visibility of the page and update the state accordingly.
   */
  useEffect(() => {
    function handleVisibilityChange() {
      setPageVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /**
   * Updates the activity for the managed server every 60 seconds.
   */
  useInterval(() => {
    if (!isPageVisible || managedServer === undefined) {
      return;
    }
    updateActivity(managedServer.userPrincipalName);
  }, 60000);

  return null;
}

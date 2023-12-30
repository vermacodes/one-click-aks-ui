import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../../../dataStructures";
import { getDefaultServerHosting } from "../../../defaults";
import { useDeployManagedServer } from "../../../hooks/useDeployManagedServer";
import useInterval from "../../../hooks/useInterval";
import { useManagedServer, useManagedServerActivityUpdate } from "../../../hooks/useManagedServer";

export default function ManagedServerActivityMonitor() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);
  const [serverHosting, setServerHosting] = useState<ServerHosting>(getDefaultServerHosting());

  const isPageVisibleRef = useRef(isPageVisible);
  const serverHostingRef = useRef(serverHosting);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();

  const { handleDeploy } = useDeployManagedServer();
  const queryClient = useQueryClient();

  useEffect(() => {
    const serverHostingFromLocalStorage = localStorage.getItem("serverHosting");
    if (serverHostingFromLocalStorage != undefined && serverHostingFromLocalStorage !== "") {
      setServerHosting(JSON.parse(serverHostingFromLocalStorage));
    }
  }, []);

  /**
   * runs when the page visibility changes.
   * It invalidates the "get-managed-server" query in the query client
   * and updates the activity for the managed server if it is defined.
   *
   */
  useEffect(() => {
    if (isPageVisible) {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");

      if (managedServer !== undefined && serverHosting.environment === "azure") {
        updateActivity(managedServer.userPrincipalName);
      }
    }

    isPageVisibleRef.current = isPageVisible;
    serverHostingRef.current = serverHosting;

    return () => {
      if (timeoutIdRef.current !== null) {
        console.log("Clearing timeout.");
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isPageVisible, serverHosting]);

  /**
   * handles auto creation of a new managed server if the previous one was auto destroyed.
   */
  useEffect(() => {
    if (managedServer === undefined || serverHosting.environment !== "azure") {
      return;
    }

    // if managed server was auto destroyed and the page is visible, auto create a new one
    if (managedServer.status === "AutoDestroyed" && isPageVisible && managedServer.autoCreate) {
      // wait for 10 seconds before creating a new managed server
      timeoutIdRef.current = setTimeout(() => {
        if (isPageVisibleRef.current && serverHostingRef.current.environment === "azure") {
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
    if (!isPageVisible || managedServer === undefined || serverHosting.environment !== "azure") {
      return;
    }
    updateActivity(managedServer.userPrincipalName);
  }, 60000);

  return null;
}

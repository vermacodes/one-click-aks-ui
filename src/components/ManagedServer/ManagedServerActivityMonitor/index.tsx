import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../../../dataStructures";
import { useDeployManagedServer } from "../../../hooks/useDeployManagedServer";
import useInterval from "../../../hooks/useInterval";
import {
  useManagedServer,
  useManagedServerActivityUpdate,
} from "../../../hooks/useManagedServer";
import { useResetServerCache } from "../../../hooks/useServerCache";

export default function ManagedServerActivityMonitor() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);
  const [serverHosting, setServerHosting] = useState<ServerHosting>(
    getServerHostingFromLocalStorage(),
  );

  const isPageVisibleRef = useRef(isPageVisible);
  const serverHostingRef = useRef(serverHosting);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();
  const { mutateAsync: resetServerCache } = useResetServerCache();

  const { handleDeploy } = useDeployManagedServer();
  const queryClient = useQueryClient();

  /**
   * This effect is triggered when the `managedServer` changes.
   * It checks if the server hosting information stored in local storage is for an Azure environment and if the endpoint is empty.
   * If these conditions are met, it updates the server hosting information in both local storage and state with the `managedServer`'s endpoint.
   * It then reloads the page and resets the server cache, invalidating all queries in the query client.
   */
  useEffect(() => {
    // Get the server hosting information from local storage
    const serverHostingFromLocalStorage: ServerHosting =
      getServerHostingFromLocalStorage();

    // Check if the server hosting information is for an Azure environment and if the endpoint is not the same as the `managedServer`'s endpoint
    if (
      managedServer &&
      (serverHostingFromLocalStorage === undefined ||
        Object.keys(serverHostingFromLocalStorage).length === 0 ||
        (serverHostingFromLocalStorage.environment === "azure" &&
          serverHostingFromLocalStorage.endpoint !==
            "https://" + managedServer.endpoint + "/"))
    ) {
      // Create a new server hosting object with the `managedServer`'s endpoint
      const newServerHosting: ServerHosting = {
        environment: "azure",
        endpoint: "https://" + managedServer.endpoint + "/",
      };

      // Update the server hosting information in both local storage and state
      setServerHosting(newServerHosting);
      localStorage.setItem("serverHosting", JSON.stringify(newServerHosting));

      // Reload the page and reset the server cache
      window.location.reload();
      resetServerCache().finally(() => {
        // Invalidate all queries in the query client
        const queryClient = useQueryClient();
        queryClient.invalidateQueries();
      });
    }
  }, [managedServer]);

  /**
   * handles auto creation of a new managed server if the previous one was auto destroyed.
   */
  useEffect(() => {
    if (managedServer === undefined || serverHosting.environment !== "azure") {
      return;
    }

    // if managed server was auto destroyed and the page is visible, auto create a new one
    if (
      (managedServer.status === "AutoDestroyed" ||
        managedServer.status === "Registered") &&
      isPageVisible &&
      managedServer.autoCreate
    ) {
      // wait for 2 seconds before creating a new managed server
      timeoutIdRef.current = setTimeout(() => {
        if (
          isPageVisibleRef.current &&
          serverHostingRef.current.environment === "azure"
        ) {
          handleDeploy(managedServer);
        }
      }, 2000); // 2 seconds delay
    }
  }, [managedServer]);

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

      if (
        managedServer !== undefined &&
        serverHosting.environment === "azure"
      ) {
        updateActivity(managedServer.userPrincipalName);
      }
    }

    isPageVisibleRef.current = isPageVisible;
    serverHostingRef.current = serverHosting;

    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isPageVisible, serverHosting]);

  /**
   * Sets up an event listener to track the visibility of the page and update the state accordingly.
   */
  useEffect(() => {
    function handleVisibilityChange() {
      setPageVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /**
   * If managed cluster status is 'Deploying' start a poller to check the status every 10 seconds.
   * As soon as the status changes to something other than 'Deploying', stop the poller.
   * and refresh the page.
   */
  useEffect(() => {
    if (managedServer === undefined || serverHosting.environment !== "azure") {
      return;
    }

    if (
      managedServer.status === "Deploying" ||
      managedServer.status === "AutoDestroyed" ||
      managedServer.status === "Destroyed"
    ) {
      const intervalId = setInterval(() => {
        if (
          managedServer !== undefined &&
          serverHosting.environment === "azure"
        ) {
          queryClient.invalidateQueries("get-managed-server");
          queryClient.invalidateQueries("server-status");
        }
      }, 2000); // 2 seconds interval

      return () => clearInterval(intervalId);
    }
  }, [managedServer]);

  /**
   * Retrieves the server hosting information from local storage.
   *
   * @returns {ServerHosting} The server hosting information.
   */
  function getServerHostingFromLocalStorage(): ServerHosting {
    const serverHostingFromLocalStorageString =
      localStorage.getItem("serverHosting") || "{}";
    return JSON.parse(serverHostingFromLocalStorageString);
  }

  /**
   * Updates the activity for the managed server every 60 seconds.
   */
  useInterval(() => {
    // Get the server hosting information from local storage
    const serverHostingFromLocalStorage: ServerHosting =
      getServerHostingFromLocalStorage();

    if (
      !isPageVisible ||
      managedServer === undefined ||
      serverHostingFromLocalStorage.environment !== "azure"
    ) {
      return;
    }
    updateActivity(managedServer.userPrincipalName);
  }, 60000);

  return null;
}

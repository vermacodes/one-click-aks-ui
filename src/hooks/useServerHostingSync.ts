import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../dataStructures";
import { getDefaultServerHosting } from "../defaults";
import { useManagedServer } from "./useManagedServer";
import { useResetServerCache } from "./useServerCache";

function getServerHostingFromLocalStorage(): ServerHosting {
  const serverHostingFromLocalStorageString =
    localStorage.getItem("serverHosting") || "{}";

  try {
    const parsed = JSON.parse(serverHostingFromLocalStorageString);
    return Object.keys(parsed).length === 0
      ? getDefaultServerHosting()
      : parsed;
  } catch {
    return getDefaultServerHosting();
  }
}

export function useServerHostingSync() {
  const [serverHosting, setServerHosting] = useState<ServerHosting>(
    getServerHostingFromLocalStorage(),
  );

  const { data: managedServer } = useManagedServer();
  const { mutateAsync: resetServerCache } = useResetServerCache();
  const queryClient = useQueryClient();

  // Auto-sync with managed server
  useEffect(() => {
    const serverHostingFromLocalStorage: ServerHosting =
      getServerHostingFromLocalStorage();

    if (
      managedServer &&
      (serverHostingFromLocalStorage === undefined ||
        Object.keys(serverHostingFromLocalStorage).length === 0 ||
        (serverHostingFromLocalStorage.environment === "azure" &&
          serverHostingFromLocalStorage.endpoint !== managedServer?.endpoint))
    ) {
      const newServerHosting: ServerHosting = {
        environment: "azure",
        endpoint: managedServer.endpoint,
      };

      setServerHosting(newServerHosting);
      localStorage.setItem("serverHosting", JSON.stringify(newServerHosting));

      window.location.reload();
      resetServerCache().finally(() => {
        queryClient.invalidateQueries();
      });
    }
  }, [managedServer, resetServerCache, queryClient]);

  // Manual update function
  const updateServerHosting = useCallback(
    (newServerHosting: ServerHosting) => {
      if (
        newServerHosting.environment === serverHosting.environment &&
        newServerHosting.endpoint === serverHosting.endpoint
      ) {
        return;
      }

      localStorage.setItem("serverHosting", JSON.stringify(newServerHosting));
      setServerHosting(newServerHosting);

      window.location.reload();
      resetServerCache().finally(() => {
        queryClient.invalidateQueries();
      });
    },
    [serverHosting, resetServerCache, queryClient],
  );

  return { serverHosting, updateServerHosting };
}

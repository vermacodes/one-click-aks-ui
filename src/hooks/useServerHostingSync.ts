import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../dataStructures";
import { useManagedServer } from "./useManagedServer";
import { useResetServerCache } from "./useServerCache";

function getServerHostingFromLocalStorage(): ServerHosting {
  const serverHostingFromLocalStorageString =
    localStorage.getItem("serverHosting") || "{}";
  return JSON.parse(serverHostingFromLocalStorageString);
}

export function useServerHostingSync() {
  const [serverHosting, setServerHosting] = useState<ServerHosting>(
    getServerHostingFromLocalStorage(),
  );

  const { data: managedServer } = useManagedServer();
  const { mutateAsync: resetServerCache } = useResetServerCache();
  const queryClient = useQueryClient();

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

  return { serverHosting };
}

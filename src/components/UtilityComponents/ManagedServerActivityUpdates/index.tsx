import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import useInterval from "../../../hooks/useInterval";
import { useCreateManagedServer, useManagedServer, useManagedServerActivityUpdate } from "../../../hooks/useManagedServer";
import { useResetServerCache } from "../../../hooks/useServerCache";
import { isManagedServer } from "../../../utils/typeguards";

export default function ManagedServerActivityUpdates() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);

  const { mutateAsync: resetServerCache } = useResetServerCache();

  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();
  const { mutateAsync: deployManagedServer } = useCreateManagedServer();

  useEffect(() => {
    if (managedServer === undefined) {
      return;
    }

    // if managed server was destroyed more than 5 minutes ago, and user is active again, deploy again.
    if (managedServer.status === "Destroyed" && isPageVisible) {
      console.log("Destroyed at time", managedServer.destroyedAtTime);
      const destroyedAtTime = new Date(managedServer.destroyedAtTime);
      const now = new Date();
      const diff = now.getTime() - destroyedAtTime.getTime();
      const minutes = Math.floor(diff / 1000 / 60);
      if (minutes > 1 && isPageVisible) {
        handleDeploy();
      }
    }
  }, [managedServer, isPageVisible]);

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

  function handleSwitch(baseUrl: string) {
    localStorage.setItem("baseUrl", baseUrl);
    window.location.reload();
    resetServerCache().finally(() => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries();
    });
  }

  function handleDeploy() {
    if (managedServer === undefined) {
      toast.error("Failed to auto deploy managed server.");
      return;
    }
    const response = toast.promise(deployManagedServer(managedServer), {
      pending: "Deploying managed server...",
      success: {
        render(data: any) {
          if (isManagedServer(data?.data?.data)) {
            return `Managed server ${data.data.data.status}.`;
          }
        },
        autoClose: 2000,
      },
      error: {
        render(data: any) {
          return `Failed to deploy managed server.`;
        },
        autoClose: 5000,
      },
    });

    response.then((data) => {
      if (data.data === undefined) {
        return;
      }
      if (isManagedServer(data.data) && data.data.status === "Running") {
        handleSwitch(`https://${data.data.endpoint}/`);
      }
    });
  }

  return null;
}

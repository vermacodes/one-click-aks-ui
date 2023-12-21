import { useEffect, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import { useManagedServer, useManagedServerActivityUpdate } from "../../../hooks/useManagedServer";

export default function ManagedServerActivityUpdates() {
  const { data: managedServer } = useManagedServer();
  const { mutate: updateActivity } = useManagedServerActivityUpdate();
  const [isPageVisible, setPageVisible] = useState(!document.hidden);

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
  }, 1000);

  return null;
}

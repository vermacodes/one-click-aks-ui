import { useEffect, useState } from "react";
import { useServerStatus } from "./useServerStatus";

export interface ServerSyncState {
  isOnline: boolean;
  wasOffline: boolean;
  lastStatusChange: number;
}

export interface ServerSyncAction {
  action: "server_recovered" | "server_offline" | "no_change";
  resetRetries?: boolean;
  resumeConnections?: boolean;
  pauseConnections?: boolean;
  clearConnections?: boolean;
}

export function useWebSocketServerSync(): {
  serverState: ServerSyncState;
  lastAction: ServerSyncAction;
} {
  const { data: serverStatus, isError } = useServerStatus();

  const [serverState, setServerState] = useState<ServerSyncState>({
    isOnline: false,
    wasOffline: false,
    lastStatusChange: Date.now(),
  });

  const [lastAction, setLastAction] = useState<ServerSyncAction>({
    action: "no_change",
  });

  useEffect(() => {
    const currentlyOnline = !isError && serverStatus?.status === "OK";
    const wasOnline = serverState.isOnline;
    const wasOffline = serverState.wasOffline;

    if (!wasOnline && currentlyOnline && wasOffline) {
      // Server just came back online after being offline
      setServerState({
        isOnline: true,
        wasOffline: false,
        lastStatusChange: Date.now(),
      });

      setLastAction({
        action: "server_recovered",
        resetRetries: true,
        resumeConnections: true,
      });

      return;
    }

    if (wasOnline && !currentlyOnline) {
      // Server just went offline
      setServerState({
        isOnline: false,
        wasOffline: true,
        lastStatusChange: Date.now(),
      });

      setLastAction({
        action: "server_offline",
        pauseConnections: true,
        clearConnections: true,
      });

      return;
    }

    // Update state without action if status changed but no significant transition
    if (wasOnline !== currentlyOnline) {
      setServerState((prev) => ({
        ...prev,
        isOnline: currentlyOnline,
        lastStatusChange: Date.now(),
      }));
    }

    // No significant change
    setLastAction({ action: "no_change" });
  }, [serverStatus, isError, serverState.isOnline, serverState.wasOffline]);

  return {
    serverState,
    lastAction,
  };
}

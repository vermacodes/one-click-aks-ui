import { useEffect, useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { useAccount } from "../../../hooks/useAccount";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

// Configuration for polling behavior
const POLLING_CONFIG = {
  INITIAL_DELAY: 2_000, // Start polling after 2 seconds
  MAX_INTERVAL: 30_000, // Maximum interval of 30 seconds
  MAX_ATTEMPTS: 10, // Stop after 10 attempts
  BACKOFF_MULTIPLIER: 1.5, // Exponential backoff multiplier
} as const;

export default function NoSubscriptionsFound() {
  const { data: serverStatus, isError } = useServerStatus();
  const {
    data: accounts,
    refetch: getAccounts,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
  } = useAccount();

  const [pollingAttempts, setPollingAttempts] = useState<number>(0);
  const [currentInterval, setCurrentInterval] = useState<number>(
    POLLING_CONFIG.INITIAL_DELAY,
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const shouldPoll =
      !accountsLoading &&
      !accountsFetching &&
      (!accounts || accounts.length === 0) &&
      pollingAttempts < POLLING_CONFIG.MAX_ATTEMPTS &&
      serverStatus?.status === "OK";

    if (shouldPoll) {
      timeoutId = setTimeout(() => {
        getAccounts();
        setPollingAttempts((prev) => prev + 1);

        // Exponential backoff: increase interval for next attempt
        setCurrentInterval((prev) =>
          Math.min(
            prev * POLLING_CONFIG.BACKOFF_MULTIPLIER,
            POLLING_CONFIG.MAX_INTERVAL,
          ),
        );
      }, currentInterval);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    accountsLoading,
    accountsFetching,
    accounts,
    getAccounts,
    pollingAttempts,
    currentInterval,
    serverStatus?.status,
  ]);

  // Reset polling when accounts are found
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setPollingAttempts(0);
      setCurrentInterval(POLLING_CONFIG.INITIAL_DELAY);
    }
  }, [accounts]);

  // Don't show anything if we have accounts or if we're in initial loading
  if ((accounts && accounts.length > 0) || accountsLoading) {
    return null;
  }

  // Don't show anything if server is not OK
  if (isError || serverStatus?.status !== "OK") {
    return null;
  }

  // Show different messages based on polling state
  const getMessage = () => {
    if (accountsFetching) {
      return "Fetching subscriptions...";
    }

    if (pollingAttempts >= POLLING_CONFIG.MAX_ATTEMPTS) {
      return "Unable to load subscriptions. Please check your permissions or try refreshing the page.";
    }

    if (pollingAttempts > 0) {
      return `Retrying subscription fetch (attempt ${pollingAttempts}/${POLLING_CONFIG.MAX_ATTEMPTS})...`;
    }

    return "Loading subscriptions...";
  };

  const getVariant = () => {
    if (pollingAttempts >= POLLING_CONFIG.MAX_ATTEMPTS) {
      return "warning" as const;
    }
    return "info" as const;
  };

  return (
    <Alert variant={getVariant()}>
      <div className="flex items-center gap-2">
        {pollingAttempts < POLLING_CONFIG.MAX_ATTEMPTS && (
          <TbFidgetSpinner className="animate-spin" />
        )}
        <div className="flex flex-col">
          <strong>
            {pollingAttempts >= POLLING_CONFIG.MAX_ATTEMPTS
              ? "⚠️ Subscription Loading Failed"
              : "📋 Loading Subscriptions"}
          </strong>
          <span className="text-sm">{getMessage()}</span>
          {pollingAttempts > 0 &&
            pollingAttempts < POLLING_CONFIG.MAX_ATTEMPTS && (
              <span className="text-xs opacity-75">
                Next retry in {Math.round(currentInterval / 1000)}s
              </span>
            )}
        </div>
      </div>
    </Alert>
  );
}

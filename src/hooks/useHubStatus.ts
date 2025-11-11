import { AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import { actlabsHubAxiosInstance } from "../utils/axios-interceptors";

interface HubStatus {
  status: "OK" | "ERROR";
  httpStatus: number;
}

function getHubStatus(): Promise<AxiosResponse<any>> {
  return actlabsHubAxiosInstance.get("healthz");
}

export function useHubStatus() {
  const queryClient = useQueryClient();

  return useQuery("hub-status", getHubStatus, {
    select: (response): HubStatus => {
      // Since the endpoint only returns HTTP status, we derive the status from the response
      return {
        status:
          response.status >= 200 && response.status < 300 ? "OK" : "ERROR",
        httpStatus: response.status,
      };
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on network/connection errors - fail fast
      return false;
    },
    onError: () => {
      // Clear cached data when error occurs so data becomes undefined
      queryClient.setQueryData("hub-status", undefined);
    },
  });
}

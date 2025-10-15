import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { actlabsHubAxiosInstance } from "../utils/axios-interceptors";

interface HubStatus {
  status: "OK" | "ERROR";
  httpStatus: number;
}

function getHubStatus(): Promise<AxiosResponse<any>> {
  return actlabsHubAxiosInstance.get("healthz");
}

export function useHubStatus() {
  return useQuery("hub-status", getHubStatus, {
    select: (response): HubStatus => {
      // Since the endpoint only returns HTTP status, we derive the status from the response
      return {
        status:
          response.status >= 200 && response.status < 300 ? "OK" : "ERROR",
        httpStatus: response.status,
      };
    },
    // Consider 4xx and 5xx as errors, but still process them in select
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry on network errors and 5xx errors, up to 3 times
      return failureCount < 3;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

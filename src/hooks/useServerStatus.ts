import { AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import { ServerStatus } from "../dataStructures";
import { axiosInstance } from "../utils/axios-interceptors";

function getServerStatus(): Promise<AxiosResponse<ServerStatus>> {
  return axiosInstance.get("status");
}

export function useServerStatus() {
  const queryClient = useQueryClient();

  return useQuery("server-status", getServerStatus, {
    select: (data): ServerStatus => {
      return data.data;
    },
    refetchInterval: 10000,
    onError: () => {
      // Clear cached data when error occurs so data becomes undefined
      queryClient.setQueryData("server-status", undefined);
    },
  });
}

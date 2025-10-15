import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { ServerStatus } from "../dataStructures";
import { axiosInstance } from "../utils/axios-interceptors";

function getServerStatus(): Promise<AxiosResponse<ServerStatus>> {
  return axiosInstance.get("status");
}

export function useServerStatus() {
  return useQuery("server-status", getServerStatus, {
    select: (data): ServerStatus => {
      return data.data;
    },
  });
}

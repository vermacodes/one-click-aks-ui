import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { AROVersions } from "../dataStructures";
import { axiosInstance } from "../utils/axios-interceptors";

function getAROVersions(): Promise<AxiosResponse<AROVersions>> {
  return axiosInstance.get("aroversion");
}

export function useGetAROVersions() {
  return useQuery("getAROVersions", getAROVersions, {
    select: (data): AROVersions => {
      return data.data;
    },
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
}

function getDefaultAROVersion(): Promise<AxiosResponse<string>> {
  return axiosInstance.get("aroversion/default");
}

export function useGetDefaultAROVersion() {
  return useQuery("getDefaultAROVersion", getDefaultAROVersion, {
    select: (data): string => {
      return data.data;
    },
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
}

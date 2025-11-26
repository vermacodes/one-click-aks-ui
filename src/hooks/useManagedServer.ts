import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ManagedServer } from "../dataStructures";
import { actlabsHubAxiosInstance } from "../utils/axios-interceptors";

function getManagedServer(): Promise<AxiosResponse<ManagedServer>> {
  return actlabsHubAxiosInstance.get("server");
}

export function useManagedServer() {
  return useQuery("get-managed-server", getManagedServer, {
    select: (data): ManagedServer => {
      return data.data;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });
}

function adminGetAllManagedServers(): Promise<AxiosResponse<ManagedServer[]>> {
  return actlabsHubAxiosInstance.get("admin/servers");
}

export function useAdminGetAllManagedServers() {
  return useQuery("get-managed-servers", adminGetAllManagedServers, {
    select: (data): ManagedServer[] => {
      return data.data;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });
}

export function useManagedServerActivityUpdate() {
  return useMutation((userPrincipalName: string) =>
    actlabsHubAxiosInstance.put(`server/activity/${userPrincipalName}`),
  );
}

export function useRegisterSubscription() {
  const queryClient = useQueryClient();
  return useMutation(
    (serverData: Partial<ManagedServer>) =>
      actlabsHubAxiosInstance.put("server/register", serverData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-managed-server");
        queryClient.invalidateQueries("server-status");
      },
    },
  );
}

export function useUnregister() {
  const queryClient = useQueryClient();
  return useMutation(() => actlabsHubAxiosInstance.put("server/unregister"), {
    onSuccess: () => {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");
    },
  });
}

export function useAdminUnregister() {
  const queryClient = useQueryClient();
  return useMutation(
    (userPrincipalName: string) =>
      actlabsHubAxiosInstance.delete(
        `admin/server/unregister/${userPrincipalName}`,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-managed-servers");
        queryClient.invalidateQueries("server-status");
      },
    },
  );
}

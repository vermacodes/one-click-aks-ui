import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ManagedServer } from "../dataStructures";
import { authAxiosInstance } from "../utils/axios-interceptors";

function getManagedServer(): Promise<AxiosResponse<ManagedServer>> {
  return authAxiosInstance.get("server");
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

export function useManagedServerActivityUpdate() {
  const queryClient = useQueryClient();
  return useMutation((userPrincipalName: string) => authAxiosInstance.put(`server/activity/${userPrincipalName}`));
}

export function useDestroyManagedServer() {
  const queryClient = useQueryClient();
  return useMutation(() => authAxiosInstance.delete("server"), {
    onSuccess: () => {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");
    },
  });
}

export function useCreateManagedServer() {
  const queryClient = useQueryClient();
  return useMutation((managedServer: ManagedServer) => authAxiosInstance.put("server", managedServer), {
    onSuccess: () => {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");
    },
  });
}

export function useRegisterSubscription() {
  const queryClient = useQueryClient();
  return useMutation((subscriptionId: string) => authAxiosInstance.put(`server/register/${subscriptionId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("get-managed-server");
      queryClient.invalidateQueries("server-status");
    },
  });
}

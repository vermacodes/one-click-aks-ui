import { useMutation } from "react-query";
import { axiosInstance } from "../utils/axios-interceptors";

function breakBlobLease(workspaceName: string) {
  return axiosInstance.put(`storageaccount/breakbloblease/${workspaceName}`);
}

export function useBreakBlobLease() {
  return useMutation(breakBlobLease);
}

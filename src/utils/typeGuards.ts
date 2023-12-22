import { ManagedServer } from "../dataStructures";

export function isManagedServer(data: unknown): data is ManagedServer {
  return (data as ManagedServer).status !== undefined && (data as ManagedServer).endpoint !== undefined;
}

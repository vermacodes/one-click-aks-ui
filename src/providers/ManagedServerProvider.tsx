import React from "react";
import { useActivityMonitoring } from "../hooks/useActivityMonitoring";
import { useDeploymentPolling } from "../hooks/useDeploymentPolling";
import { usePageVisibility } from "../hooks/usePageVisibility";
import { useServerHostingSync } from "../hooks/useServerHostingSync";

interface ManagedServerProviderProps {
  children: React.ReactNode;
}

export function ManagedServerProvider({
  children,
}: ManagedServerProviderProps) {
  // Initialize all managed server related effects
  usePageVisibility();
  useServerHostingSync();
  useActivityMonitoring();
  useDeploymentPolling();

  return <>{children}</>;
}

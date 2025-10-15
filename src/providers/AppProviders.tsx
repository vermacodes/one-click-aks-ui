import React from "react";
import { ManagedServerProvider } from "./ManagedServerProvider";
// Import other providers as needed

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ManagedServerProvider>
      {/* Add other providers here as you create them */}
      {children}
    </ManagedServerProvider>
  );
}

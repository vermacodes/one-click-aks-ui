import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ManagedServerProvider } from "./ManagedServerProvider";
import WebSocketContextProvider from "./WebSocketContextProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <WebSocketContextProvider>
        <ManagedServerProvider>{children}</ManagedServerProvider>
      </WebSocketContextProvider>
    </AuthProvider>
  );
}

import { createContext, useContext } from "react";
import { GraphData } from "../../dataStructures";

interface AuthContextData {
  graphResponse: GraphData | undefined;
  setGraphResponse: React.Dispatch<React.SetStateAction<GraphData | undefined>>;
  profilePhoto: string | undefined;
  setProfilePhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
  graphAPIAccessToken: string | undefined;
  setGraphAPIAccessToken: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

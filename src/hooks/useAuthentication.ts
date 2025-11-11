import * as msal from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { graphAPIScope } from "../authConfig";
import { GraphData } from "../dataStructures";

type TokenRequest = {
  scopes: string[];
  account: msal.AccountInfo;
};

export function useAuthentication() {
  const { instance } = useMsal();
  const [graphResponse, setGraphResponse] = useState<GraphData>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [graphAPIAccessToken, setGraphAPIAccessToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  // request access tokens after the component has mounted
  useEffect(() => {
    RequestGraphAPIAccessToken();
  }, []);

  useEffect(() => {
    if (graphAPIAccessToken && graphAPIAccessToken !== "") {
      getGraphData();
      getProfilePhoto();
    }
  }, [graphAPIAccessToken]);

  async function getGraphData() {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${graphAPIAccessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGraphResponse(data);
        setLoading(false);
      } else {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user data");
      setLoading(false);
    }
  }

  async function getProfilePhoto() {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: {
          Authorization: `Bearer ${graphAPIAccessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.blob();
        const url = URL.createObjectURL(data);
        setProfilePhoto(url);
      }
      // Note: Not setting error for photo fetch failure as it's optional
    } catch (err) {
      console.warn("Failed to fetch profile photo:", err);
    }
  }

  async function RequestGraphAPIAccessToken() {
    try {
      await instance.handleRedirectPromise();

      const accounts = instance.getAllAccounts();
      const request = {
        ...graphAPIScope,
        account: accounts[0],
      };

      if (accounts.length > 0) {
        try {
          await acquireTokenSilently(request);
        } catch (e) {
          if (e instanceof msal.InteractionRequiredAuthError) {
            acquireTokenByRedirect(request);
          } else {
            throw e;
          }
        }
      } else {
        acquireTokenByRedirect(request);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setLoading(false);
    }
  }

  async function acquireTokenSilently(request: TokenRequest) {
    const response = await instance.acquireTokenSilent(request);
    setGraphAPIAccessToken(response.accessToken);
  }

  function acquireTokenByRedirect(request: TokenRequest) {
    instance.acquireTokenRedirect(request);
  }

  return {
    graphResponse,
    profilePhoto,
    graphAPIAccessToken,
    loading,
    error,
    isAuthenticated: !!graphAPIAccessToken && !!graphResponse && !loading,
  };
}
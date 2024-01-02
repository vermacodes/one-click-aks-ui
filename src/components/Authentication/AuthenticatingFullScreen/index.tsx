import * as msal from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { graphAPIScope } from "../../../authConfig";
import { GraphData } from "../../../dataStructures";

type TokenRequest = {
  scopes: string[];
  account: msal.AccountInfo;
};

type Props = {
  graphResponse: GraphData | undefined;
  setGraphResponse: (updatedGraphData: GraphData | undefined) => void;
  profilePhoto: string | undefined;
  setProfilePhoto: (profilePhoto: string | undefined) => void;
  graphAPIAccessToken: string | undefined;
  setGraphAPIAccessToken: (graphAPIAccessToken: string | undefined) => void;
};

export default function AuthenticatingFullScreen({
  setGraphResponse,
  setProfilePhoto,
  graphAPIAccessToken,
  setGraphAPIAccessToken,
}: Props) {
  const { instance } = useMsal();
  //const [graphAPIAccessToken, setGraphAPIAccessToken] = useState<string>("");
  const [graphAPITokenAcquired, setGraphAPITokenAcquired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // request access tokens after the component has mounted
  useEffect(() => {
    RequestGraphAPIAccessToken();
  }, []);

  useEffect(() => {
    if (graphAPITokenAcquired && graphAPIAccessToken !== "") {
      getGraphData();
      getProfilePhoto();
    }
  }, [graphAPITokenAcquired, graphAPIAccessToken]);

  async function getGraphData() {
    fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${graphAPIAccessToken}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setGraphResponse(data);
          setLoading(false);
        });
      }
    });
  }

  async function getProfilePhoto() {
    fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: {
        Authorization: `Bearer ${graphAPIAccessToken}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.blob().then((data) => {
          const url = URL.createObjectURL(data);
          setProfilePhoto(url);
        });
      }
    });
  }

  async function RequestGraphAPIAccessToken() {
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
          console.error(e);
        }
      }
    } else {
      acquireTokenByRedirect(request);
    }
  }

  async function acquireTokenSilently(request: TokenRequest) {
    const response = await instance.acquireTokenSilent(request);
    setGraphAPIAccessToken(response.accessToken);
    setGraphAPITokenAcquired(true);
  }

  function acquireTokenByRedirect(request: TokenRequest) {
    instance.acquireTokenRedirect(request);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  // Return your main component here
  return null;
}

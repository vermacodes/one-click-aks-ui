import { useEffect, useState } from "react";
import { useAuth } from "../components/Context/AuthContext";

export function useGetProfilePhoto(userPrincipal: string) {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const { graphAPIAccessToken } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function getProfilePhoto() {
      if (userPrincipal === undefined || userPrincipal === "") {
        return;
      }

      const cache = await caches.open("profile-photos");
      const cachedResponse = await cache.match(userPrincipal);

      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setProfilePhoto(url);
        } else {
          setProfilePhoto("");
        }
        return;
      }

      const response = await fetch(`https://graph.microsoft.com/v1.0/users/${userPrincipal}/photo/$value`, {
        headers: {
          Authorization: `Bearer ${graphAPIAccessToken}`,
        },
      });

      if (response.ok) {
        cache.put(userPrincipal, response.clone());
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setProfilePhoto(url);
        }
      } else if (response.status === 404) {
        // Create a new Response object with an empty string as the body
        const emptyResponse = new Response("");
        cache.put(userPrincipal, emptyResponse);
      }
    }

    getProfilePhoto();

    return () => {
      isMounted = false;
    };
  }, [userPrincipal]);

  return { profilePhoto };
}

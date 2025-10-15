import { PropsWithChildren, useEffect } from "react";
import { Profile } from "../dataStructures";
import { useCreateProfile } from "../hooks/useProfile";
import { useAuthentication } from "../hooks/useAuthentication";
import { AuthenticatingScreen } from "../components/Authentication/AuthenticatingScreen";
import { AuthContext } from "../context/AuthContext";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
	const authData = useAuthentication();
	const { mutate: createProfile } = useCreateProfile();

	useEffect(() => {
		if (authData.graphResponse) {
			let profile: Profile = {
				displayName: authData.graphResponse.displayName,
				objectId: authData.graphResponse.id,
				userPrincipal: authData.graphResponse.userPrincipalName,
				roles: [],
			};

			createProfile(profile);
		}
	}, [authData.graphResponse, createProfile]);

	// Show loading screen while authenticating
	if (authData.loading) {
		return <AuthenticatingScreen />;
	}

	// Show error screen if authentication failed
	if (authData.error) {
		return <AuthenticatingScreen error={authData.error} />;
	}

	// Only render children when authenticated
	if (!authData.isAuthenticated) {
		return <AuthenticatingScreen />;
	}

	return (
		<AuthContext.Provider
			value={{
				graphResponse: authData.graphResponse,
				setGraphResponse: () => {}, // No-op as authentication is managed by the hook
				profilePhoto: authData.profilePhoto,
				setProfilePhoto: () => {}, // No-op as authentication is managed by the hook
				graphAPIAccessToken: authData.graphAPIAccessToken,
				setGraphAPIAccessToken: () => {}, // No-op as authentication is managed by the hook
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
import { createContext, useContext, useEffect, useState } from "react";
import { GraphData, Profile } from "../../../dataStructures";
import { useCreateProfile } from "../../../hooks/useProfile";
import AuthenticatingFullScreen from "../../Authentication/AuthenticatingFullScreen";

interface AuthContextData {
	graphResponse: GraphData | undefined;
	setGraphResponse: React.Dispatch<React.SetStateAction<GraphData | undefined>>;
	profilePhoto: string | undefined;
	setProfilePhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
	graphAPIAccessToken: string | undefined;
	setGraphAPIAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

type Props = {
	children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
	const [graphResponse, setGraphResponse] = useState<GraphData | undefined>();
	const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
	const [graphAPIAccessToken, setGraphAPIAccessToken] = useState<string | undefined>();

	const { mutate: createProfile } = useCreateProfile();

	useEffect(() => {
		if (graphResponse) {
			let profile: Profile = {
				displayName: graphResponse.displayName,
				objectId: graphResponse.id,
				userPrincipal: graphResponse.userPrincipalName,
				roles: [],
			};

			createProfile(profile);
		}
	}, [graphResponse]);

	return (
		<AuthContext.Provider
			value={{
				graphResponse,
				setGraphResponse,
				profilePhoto,
				setProfilePhoto,
				graphAPIAccessToken,
				setGraphAPIAccessToken,
			}}
		>
			{graphResponse ? (
				children
			) : (
				<AuthenticatingFullScreen
					setGraphResponse={setGraphResponse}
					setProfilePhoto={setProfilePhoto}
					graphAPIAccessToken={graphAPIAccessToken}
					setGraphAPIAccessToken={setGraphAPIAccessToken}
				/>
			)}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

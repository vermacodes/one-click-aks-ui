import { Profile } from "../../../dataStructures";
import { useGetProfilePhoto } from "../../../hooks/useGetProfilePhoto";

type Props = {
	profile: Profile;
	size?: "small" | "medium" | "large";
	onlyPhoto?: boolean;
};

export default function ProfileDisplay({ profile, size = "medium", onlyPhoto = false }: Props) {
	const { profilePhoto } = useGetProfilePhoto(profile.userPrincipal);

	return (
		<div className="flex h-fit items-center gap-2">
			<span>
				<img
					className={`${
						size === "small" ? "h-8 max-h-8 w-8 " : size === "medium" ? "h-12 max-h-12 w-12 " : "h-16 max-h-16 w-16 "
					} h-full max-h-12 rounded-full`}
					src={profilePhoto || "https://www.gravatar.com/avatar/?d=mp&r=g&s=200"}
					alt="Profile Picture"
				/>
			</span>
			{!onlyPhoto && (
				<div className="flex flex-col ">
					<span>{profile.displayName}</span>
					<span
						className={`${size === "small" ? "text-xs " : size === "medium" ? "text-sm " : "text-base "}
          } text-slate-600 dark:text-slate-400`}
					>
						{profile.userPrincipal}
					</span>
				</div>
			)}
		</div>
	);
}

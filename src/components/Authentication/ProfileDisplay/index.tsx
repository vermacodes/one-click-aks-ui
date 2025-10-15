import { Profile } from "../../../dataStructures";
import { useGetProfilePhoto } from "../../../hooks/useGetProfilePhoto";
import { cn } from "../../../utils/cn";

type Props = {
  profile: Profile;
  size?: "small" | "medium" | "large";
  onlyPhoto?: boolean;
  invertTextColors?: boolean;
};

export default function ProfileDisplay({
  profile,
  size = "medium",
  onlyPhoto = false,
  invertTextColors = false,
}: Props) {
  const { profilePhoto } = useGetProfilePhoto(profile.userPrincipal);

  // Size configurations
  const sizeClasses = {
    small: {
      image: "h-8 w-8",
      text: "text-xs",
    },
    medium: {
      image: "h-12 w-12",
      text: "text-sm",
    },
    large: {
      image: "h-16 w-16",
      text: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  // Clean display name by removing everything after " ("
  const displayName = profile.displayName
    ? profile.displayName.split(" (")[0].trim()
    : profile.userPrincipal;

  return (
    <div className="flex h-fit items-center gap-2">
      <img
        className={cn(
          "flex-shrink-0 rounded-full object-cover",
          currentSize.image,
        )}
        src={profilePhoto || "https://www.gravatar.com/avatar/?d=mp&r=g&s=200"}
        alt={`${displayName}'s profile picture`}
        onError={(e) => {
          // Fallback to a default avatar on error
          const target = e.target as HTMLImageElement;
          target.src = "https://www.gravatar.com/avatar/?d=mp&r=g&s=200";
        }}
      />

      {!onlyPhoto && (
        <div
          className={cn(
            "flex min-w-0 flex-col", // min-w-0 for text truncation
            invertTextColors
              ? "text-slate-100 dark:text-slate-900"
              : "text-slate-900 dark:text-slate-100",
          )}
        >
          <span className="truncate font-medium" title={displayName}>
            {displayName}
          </span>
          <span
            className={cn(
              "truncate text-gray-600 dark:text-gray-400",
              currentSize.text,
            )}
            title={profile.userPrincipal}
          >
            {profile.userPrincipal}
          </span>
        </div>
      )}
    </div>
  );
}

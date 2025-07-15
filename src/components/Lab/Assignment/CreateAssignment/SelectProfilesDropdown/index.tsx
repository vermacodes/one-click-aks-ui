import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Profile } from "../../../../../dataStructures";
import { getUIStateColors } from "../../../../../defaults";
import {
  useGetAllProfilesRedacted,
  useGetMyProfile,
} from "../../../../../hooks/useProfile";
import ProfileDisplay from "../../../../Authentication/ProfileDisplay";
import DropdownSelect from "../../../../UserInterfaceComponents/DropdownSelect";
import FilterTextBox from "../../../../UserInterfaceComponents/FilterTextBox";

type Props = {
  selectedProfiles: Profile[];
  setSelectedProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  noShowProfiles?: Profile[]; // Profiles that should not be shown in the dropdown.
};

export default function SelectProfilesDropdown({
  selectedProfiles,
  setSelectedProfiles,
  noShowProfiles,
}: Props) {
  //const [uniqueProfiles, setUniqueProfiles] = useState<string[]>([]);
  const [uniqueProfiles, setUniqueProfiles] = useState<Profile[]>([]);
  const [profileSearchTerm, setProfileSearchTerm] = useState<string>("");
  const [isRenderUserHovered, setIsRenderUserHovered] = useState(false); // State to track hover

  const {
    data: profiles,
    isLoading: profilesLoading,
    isFetching: profilesFetching,
  } = useGetAllProfilesRedacted();
  const { data: myProfile } = useGetMyProfile();

  /**
   * Effect hook to update the list of unique profiles.
   *
   * This hook runs whenever the `profiles` prop changes. It creates a new Set from the
   * current list of unique profiles, then iterates over the `profiles` array and adds each
   * profilePrincipal to the Set. If the size of the Set has changed (indicating that new
   * unique profiles were added), it updates the `uniqueProfiles` state with the new Set.
   */
  useEffect(() => {
    if (myProfile === undefined) {
      return;
    }

    // only add user's profile if they are not a mentor
    if (!myProfile?.roles.includes("mentor")) {
      setUniqueProfiles([myProfile]);
      return;
    }

    // add other profiles if user is a mentor
    if (profiles) {
      const uniqueProfileSet = new Set(uniqueProfiles);
      profiles.forEach((profile) => {
        uniqueProfileSet.add(profile);
      });
      if (uniqueProfiles.length !== uniqueProfileSet.size) {
        setUniqueProfiles([...uniqueProfileSet]);
      }
    }
  }, [profiles, myProfile]);

  /**
   * Function to render a search input field.
   *
   * @returns JSX.Element - The rendered search input field.
   */
  const profileSearchInput = () => {
    return (
      <div className="relative">
        <FilterTextBox
          placeHolderText="Filter by name or alias"
          value={profileSearchTerm}
          onChange={(value: string) => setProfileSearchTerm(value)}
        />
        {profileSearchTerm && (
          <FaTimes
            className="absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer"
            onClick={() => setProfileSearchTerm("")}
          />
        )}
      </div>
    );
  };

  /**
   * Function to handle the click event on a profile.
   *
   * @param profile - The profile that was clicked.
   */
  const onUserClick = (profile: Profile) => {
    setSelectedProfiles((selectedProfiles) =>
      selectedProfiles.includes(profile)
        ? selectedProfiles.filter((i) => i !== profile)
        : [...selectedProfiles, profile],
    );
  };

  /**
   * Function to render a profile.
   *
   * @param profile - The profile to render.
   * @returns JSX.Element - The rendered profile.
   */
  const renderUser = (profile: Profile) => {
    const isActive = selectedProfiles.includes(profile);

    const baseClasses =
      "relative w-full cursor-pointer items-center justify-between rounded-sm p-2 mt-2";
    const activeClasses = getUIStateColors({
      selected: true,
      hover: true,
      colors: "success",
    });
    const hoverClasses = getUIStateColors({
      hover: true,
    });

    const containerClasses = isActive
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;

    return (
      <div
        className={containerClasses}
        aria-label={profile.displayName}
        onMouseEnter={() => setIsRenderUserHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsRenderUserHovered(false)} // Set hover state to false
      >
        <div className="flex items-center">
          <ProfileDisplay profile={profile} />
        </div>
        {isActive && (
          <FaTimes className="absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer" />
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full">
      <DropdownSelect
        heading={
          selectedProfiles.length > 0
            ? selectedProfiles.length + " users selected."
            : "Select Users"
        }
        disabled={profilesLoading || profilesFetching}
        items={[
          ...selectedProfiles,
          ...uniqueProfiles
            .filter((profile) => !selectedProfiles.includes(profile))
            .filter((profile) => !noShowProfiles?.includes(profile))
            .filter((profile) =>
              JSON.stringify(profile)
                .toLowerCase()
                .includes(profileSearchTerm.toLowerCase()),
            ),
        ]}
        renderItem={renderUser}
        onItemClick={onUserClick}
        search={profileSearchInput()}
        height={"h-96"}
        closeMenuOnSelect={false}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Profile } from "../../../../../dataStructures";
import { useGetAllProfilesRedacted } from "../../../../../hooks/useProfile";
import ProfileDisplay from "../../../../Authentication/ProfileDisplay";
import DropdownSelect from "../../../../UserInterfaceComponents/DropdownSelect";
import FilterTextBox from "../../../../UserInterfaceComponents/FilterTextBox";

type Props = {
  selectedProfiles: Profile[];
  setSelectedProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  noShowProfiles?: Profile[]; // Profiles that should not be shown in the dropdown.
};

export default function SelectProfilesDropdown({ selectedProfiles, setSelectedProfiles, noShowProfiles }: Props) {
  //const [uniqueProfiles, setUniqueProfiles] = useState<string[]>([]);
  const [uniqueProfiles, setUniqueProfiles] = useState<Profile[]>([]);
  const [profileSearchTerm, setProfileSearchTerm] = useState<string>("");
  const { data: profiles, isLoading: profilesLoading, isFetching: profilesFetching } = useGetAllProfilesRedacted();

  /**
   * Effect hook to update the list of unique profiles.
   *
   * This hook runs whenever the `profiles` prop changes. It creates a new Set from the
   * current list of unique profiles, then iterates over the `profiles` array and adds each
   * profilePrincipal to the Set. If the size of the Set has changed (indicating that new
   * unique profiles were added), it updates the `uniqueProfiles` state with the new Set.
   */
  useEffect(() => {
    if (profiles) {
      const uniqueProfileSet = new Set(uniqueProfiles);
      profiles.forEach((profile) => {
        uniqueProfileSet.add(profile);
      });
      if (uniqueProfiles.length !== uniqueProfileSet.size) {
        setUniqueProfiles([...uniqueProfileSet]);
      }
    }
  }, [profiles]);

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
            className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer"
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
        : [...selectedProfiles, profile]
    );
  };

  /**
   * Function to render a profile.
   *
   * @param profile - The profile to render.
   * @returns JSX.Element - The rendered profile.
   */
  const renderUser = (profile: Profile) => {
    const isSelected = selectedProfiles.includes(profile);
    return (
      <div
        className={`relative ${
          isSelected
            ? "bg-green-500 bg-opacity-25 hover:bg-green-500 hover:bg-opacity-40 "
            : "hover:bg-sky-500 hover:bg-opacity-25 "
        } rounded `}
      >
        <div className="mt-1 cursor-pointer rounded p-2 hover:bg-opacity-40">
          <ProfileDisplay profile={profile} />
        </div>
        {isSelected && <FaTimes className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" />}
      </div>
    );
  };

  return (
    <div className="flex w-full">
      <DropdownSelect
        heading={selectedProfiles.length > 0 ? selectedProfiles.length + " users selected." : "Select Users"}
        disabled={profilesLoading || profilesFetching}
        items={[
          ...selectedProfiles,
          ...uniqueProfiles
            .filter((profile) => !selectedProfiles.includes(profile))
            .filter((profile) => !noShowProfiles?.includes(profile))
            .filter((profile) => JSON.stringify(profile).toLowerCase().includes(profileSearchTerm.toLowerCase())),
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

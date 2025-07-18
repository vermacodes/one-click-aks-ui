import { useEffect, useState } from "react";
import { MdClose, MdManageAccounts } from "react-icons/md";
import { toast } from "react-toastify";
import { Lab, Profile } from "../../../dataStructures";
import { useCreateLab } from "../../../hooks/useBlobs";
import {
  useGetAllProfilesRedacted,
  useGetMyProfile,
} from "../../../hooks/useProfile";
import ProfileDisplay from "../../Authentication/ProfileDisplay";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";
import ModalBackdrop from "../../UserInterfaceComponents/Modal/ModalBackdrop";
import Tooltip from "../../UserInterfaceComponents/Tooltip";
import SelectUsersDropdown from "../Assignment/CreateAssignment/SelectProfilesDropdown";

export type Props = {
  lab: Lab;
  profileType: "owners" | "editors" | "viewers";
};
export default function LabProfiles({ lab, profileType }: Props) {
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [meOwner, setMeOwner] = useState<boolean>(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: profiles } = useGetAllProfilesRedacted();
  const { data: myProfile } = useGetMyProfile();
  const title = profileType.charAt(0).toUpperCase() + profileType.slice(1);

  useEffect(() => {
    if (profiles?.length) {
      const filteredProfiles = profiles.filter((profile) => {
        return lab[profileType]?.includes(profile.userPrincipal);
      });
      setFilteredProfiles(filteredProfiles);
    }
  }, [profiles, lab, profileType]);

  useEffect(() => {
    if (filteredProfiles.length) {
      const newSelectedProfiles = filteredProfiles?.map((profile) => profile);
      setSelectedProfiles(newSelectedProfiles);
    }
  }, [filteredProfiles]);

  useEffect(() => {
    if (myProfile && lab && lab.owners !== null) {
      setMeOwner(lab.owners.includes(myProfile.userPrincipal));
    }
  }, [myProfile, lab, profileType]);

  if (!filteredProfiles?.length && !meOwner) {
    return null;
  }

  return (
    <Container title={title} hoverEffect={false} additionalClasses="outline">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <div className="flex flex-row flex-wrap gap-2">
          {filteredProfiles?.map((profile) => {
            return (
              <Tooltip
                key={profile.userPrincipal}
                message={profile.displayName || profile.userPrincipal}
                delay={1000}
              >
                <ProfileDisplay
                  profile={profile}
                  size="small"
                  onlyPhoto={true}
                />
              </Tooltip>
            );
          })}
        </div>
        {meOwner && lab.type !== "assignment" && lab.type !== "challenge" && (
          <Tooltip message={"Add or Remove " + title} delay={1000}>
            <Button variant="primary-text" onClick={() => setShowModal(true)}>
              <MdManageAccounts /> Manage Access
            </Button>
          </Tooltip>
        )}
      </div>
      {showModal && (
        <Modal
          title={title}
          lab={lab}
          profileType={profileType}
          selectedProfiles={selectedProfiles}
          setSelectedProfiles={setSelectedProfiles}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
}

type ModalProps = {
  title: string;
  lab: Lab;
  profileType: "owners" | "editors" | "viewers";
  setShowModal: (showModal: boolean) => void;
  selectedProfiles: Profile[];
  setSelectedProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
};

function Modal({
  title,
  lab,
  profileType,
  setShowModal,
  selectedProfiles,
  setSelectedProfiles,
}: ModalProps) {
  const { mutateAsync: createLab } = useCreateLab();

  function onUpdate() {
    setShowModal(false);
    lab[profileType] = selectedProfiles.map((profile) => profile.userPrincipal);
    toast.promise(createLab(lab), {
      pending: "Saving lab...",
      success: "Lab saved.",
      error: {
        render(data: any) {
          return `Lab update failed: ${data.data.response.data.error}`;
        },
        autoClose: false,
      },
    });
  }

  return (
    <ModalBackdrop
      onClick={(e) => {
        e.stopPropagation;
        setShowModal(false);
      }}
    >
      <div
        className="scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 my-20 h-[550px] w-1/3 divide-y divide-slate-300 overflow-x-hidden overflow-y-auto rounded-sm p-5 dark:divide-slate-700"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex w-100 justify-between pb-2">
          <h1 className="text-3xl">{"Add " + title}</h1>
          <Button onClick={() => setShowModal(false)} variant="secondary-icon">
            <MdClose className="text-3xl" />
          </Button>
        </div>
        <div className="flex h-[90%] w-full flex-col justify-between">
          <SelectUsersDropdown
            selectedProfiles={selectedProfiles}
            setSelectedProfiles={setSelectedProfiles}
          />
          <div className="flex flex-row justify-end gap-2">
            <Button variant="primary" onClick={onUpdate}>
              Update
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

import { useEffect } from "react";
import { Lab } from "../../../../../dataStructures";
import { useGetMyProfile } from "../../../../../hooks/useProfile";
import Checkbox from "../../../../UserInterfaceComponents/Checkbox";

type Props = {
  lab: Lab;
  setLab: (lab: Lab) => void;
};

export default function ChallengeLabControls({ lab, setLab }: Props) {
  const { data: profile } = useGetMyProfile();

  // if this is a new lab, then set the default values for the lab controls
  useEffect(() => {
    if (lab.id === "") {
      setLab({
        ...lab,
        labControls: {
          challengeLabAllowChallengeForwarding: true,
          challengeLabAllowChallengerToDeleteChallenge: true,
          challengeLabAllowUserToDeleteChallenge: true,
        },
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (profile === undefined) {
    return null;
  }

  return (
    <>
      <Checkbox
        checked={lab.labControls.challengeLabAllowChallengeForwarding === true}
        disabled={false}
        tooltipMessage="This will be saved privately in your storage account."
        id="challengeLabAllowChallengeForwarding"
        key={"challengeLabAllowChallengeForwarding"}
        label="Allow Challenge Forwarding"
        handleOnChange={() => {
          setLab({
            ...lab,
            type: "challengelab",
            labControls: {
              ...lab.labControls,
              challengeLabAllowChallengeForwarding:
                !lab.labControls.challengeLabAllowChallengeForwarding,
            },
          });
        }}
      />
      <Checkbox
        checked={
          lab.labControls.challengeLabAllowChallengerToDeleteChallenge === true
        }
        disabled={false}
        tooltipMessage="This will be visible to you and other owners."
        id="challengeLabAllowChallengerToDeleteChallenge"
        key={"challengeLabAllowChallengerToDeleteChallenge"}
        label="Allow Challenger to Delete Challenge"
        handleOnChange={() => {
          setLab({
            ...lab,
            type: "challengelab",
            labControls: {
              ...lab.labControls,
              challengeLabAllowChallengerToDeleteChallenge:
                !lab.labControls.challengeLabAllowChallengerToDeleteChallenge,
            },
          });
        }}
      />
      <Checkbox
        checked={
          lab.labControls.challengeLabAllowUserToDeleteChallenge === true
        }
        disabled={false}
        tooltipMessage={"This allows users to delete the challenge."}
        id="challengeLabAllowUserToDeleteChallenge"
        key={"challengeLabAllowUserToDeleteChallenge"}
        label="Allow User to Delete Challenge"
        handleOnChange={() =>
          setLab({
            ...lab,
            type: "challengelab",
            labControls: {
              ...lab.labControls,
              challengeLabAllowUserToDeleteChallenge:
                !lab.labControls.challengeLabAllowUserToDeleteChallenge,
            },
          })
        }
      />
    </>
  );
}

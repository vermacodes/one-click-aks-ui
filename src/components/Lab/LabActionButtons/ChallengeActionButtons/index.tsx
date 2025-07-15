import { FaCheck, FaTrophy } from "react-icons/fa";
import { Challenge, Lab } from "../../../../dataStructures";
import {
  useGetChallenges,
  useUpsertChallenges,
} from "../../../../hooks/useChallenge";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import ApplyButton from "../../../Terraform/ActionButtons/ApplyButton";
import DestroyButton from "../../../Terraform/ActionButtons/DestroyButton";
import ExtendButton from "../../../Terraform/ActionButtons/ExtendButton";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
  lab: Lab;
};

export default function ChallengeActionButtons({ lab }: Props) {
  const { data: challenges } = useGetChallenges();
  const { data: profile } = useGetMyProfile();
  const { mutateAsync: acceptChallenge } = useUpsertChallenges();

  if (!challenges || !profile) {
    return null;
  }

  function handleAcceptChallenge() {
    if (!profile) {
      return;
    }

    acceptChallenge([
      {
        labId: lab.id,
        userId: profile.userPrincipal,
        status: "accepted",
        createdBy: profile.userPrincipal,
      } as Challenge,
    ]);
  }

  const challenge = challenges.find(
    (challenge) =>
      challenge.labId === lab.id && challenge.userId === profile.userPrincipal,
  );

  if (!challenge || challenge.status === "created") {
    return (
      <div className="flex justify-start gap-1">
        <Button
          variant="primary"
          onClick={handleAcceptChallenge}
          tooltipMessage="Accept the challenge to start working on it."
        >
          <FaTrophy /> Accept Challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-1">
      <ApplyButton variant="primary-text" lab={lab}>
        Deploy
      </ApplyButton>
      <ExtendButton lab={lab} variant="success-text" mode="extend-validate">
        <FaCheck /> Validate
      </ExtendButton>
      <DestroyButton variant="danger-text" lab={lab}>
        Destroy
      </DestroyButton>
    </div>
  );
}

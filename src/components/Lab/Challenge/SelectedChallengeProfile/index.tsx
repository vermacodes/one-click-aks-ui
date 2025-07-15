import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaTrophy,
} from "react-icons/fa";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Challenge, Lab, Profile } from "../../../../dataStructures";
import {
  useDeleteChallenge,
  useGetChallengesByLabId,
  useUpsertChallenges,
} from "../../../../hooks/useChallenge";
import {
  useGetAllProfilesRedacted,
  useGetMyProfile,
} from "../../../../hooks/useProfile";
import ProfileDisplay from "../../../Authentication/ProfileDisplay";
import Button from "../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  challenge: Challenge;
  lab: Lab;
};

export default function SelectedChallengeProfile({ challenge, lab }: Props) {
  const [labId, setLabId] = useState("");
  const [challengerProfile, setChallengerProfile] = useState<Profile>(
    {} as Profile,
  );
  const [createdByProfile, setCreatedByProfile] = useState<Profile | undefined>(
    undefined,
  );
  const [meOwner, setMeOwner] = useState<boolean>(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [showConfirmCompleteModal, setShowConfirmCompleteModal] =
    useState<boolean>(false);
  const [challengeToBeDeleted, setChallengeToBeDeleted] = useState<Profile>(
    {} as Profile,
  );

  const { mutateAsync: deleteChallenge } = useDeleteChallenge();
  const { mutateAsync: upsertChallenge } = useUpsertChallenges();

  const { data: challenges } = useGetChallengesByLabId(labId);
  const { data: profiles } = useGetAllProfilesRedacted();
  const { data: myProfile } = useGetMyProfile();

  const queryClient = useQueryClient();

  if (!profiles || !challenge) {
    return null;
  }

  /**
   * This useEffect hook is used to update the labId state whenever the lab prop changes.
   */
  useEffect(() => {
    setLabId(lab.id);
  }, [lab]);

  useEffect(() => {
    if (profiles && challenge) {
      const challenger = profiles.find((profile) => {
        return profile.userPrincipal === challenge.userId;
      });
      const createdBy = profiles.find((profile) => {
        return profile.userPrincipal === challenge.createdBy;
      });
      if (challenger) {
        setChallengerProfile(challenger);
      }
      if (createdBy) {
        setCreatedByProfile(createdBy);
      } else {
        setCreatedByProfile(undefined);
      }
    }
  }, [profiles, challenge]);

  /**
   * This useEffect hook is used to check if the current user is an owner or a challenger of the lab.
   * If the user's principal is included in the lab's owners, it sets meOwner to true.
   * If there is a challenge for the user in the current lab, it sets meChallenger to true.
   */
  useEffect(() => {
    if (myProfile && lab) {
      if (lab.owners !== null && lab.owners.includes(myProfile.userPrincipal)) {
        setMeOwner(true);
      }
    }
  }, [myProfile, lab, challenges]);

  function onDeleteChallenge(profile: Profile) {
    // Owner can delete any challenge
    // Challenger can delete their own challenge
    if (
      !meOwner &&
      profile.userPrincipal !== myProfile?.userPrincipal &&
      challenge?.createdBy !== myProfile?.userPrincipal
    ) {
      return;
    }

    setChallengeToBeDeleted(profile);
    setShowConfirmDeleteModal(true);
  }

  /**
   * Deletes a challenge for a given profile.
   * If the current user is not an owner and the profile is not the current user's profile, it does nothing.
   * Otherwise, it calls the deleteChallenge function to delete the challenge.
   * While the deleteChallenge function is running, it shows a toast with the message "Deleting Challenge...".
   * If the deleteChallenge function succeeds, it shows a toast with the message "Challenge Deleted.".
   * If the deleteChallenge function fails, it shows a toast with an error message.
   * After the deleteChallenge function finishes, it invalidates the query for the challenges of the current lab.
   * @param {Profile} profile - The profile for which the challenge should be deleted.
   */
  function onConfirmDeleteChallenge() {
    setShowConfirmDeleteModal(false);

    const response = toast.promise(
      deleteChallenge(`${challengeToBeDeleted.userPrincipal}+${lab.id}`),
      {
        pending: "Deleting Challenge...",
        success: "Challenge Deleted.",
        error: {
          render(data: any) {
            return `Failed to delete challenge. ${data.data.response.data.error}`;
          },
        },
      },
    );

    response.then(() => {
      queryClient.invalidateQueries(["get-challenges-by-lab-id", lab.id]);
    });
  }

  function onCompleteChallenge() {
    if (!meOwner && challenge?.createdBy !== myProfile?.userPrincipal) {
      return;
    }

    setShowConfirmCompleteModal(true);
  }

  function onConfirmCompleteChallenge() {
    setShowConfirmCompleteModal(false);
    if (challenge) {
      challenge.status = "completed";
      challenge.completedOn = new Date().toISOString();
      upsertChallenge([challenge]);
    }
  }

  function renderStatus(challenge: Challenge) {
    if (challenge.status === "created") {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sky-700 dark:text-sky-400">
            <FaCheckCircle />{" "}
          </span>
          Created
          <span>
            {challenge.createdOn &&
              new Date(challenge.createdOn).toLocaleString()}
          </span>
        </div>
      );
    }

    if (challenge.status === "accepted") {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sky-700 dark:text-sky-400">
              <FaCheckCircle />{" "}
            </span>
            Created
            <span>
              {challenge.createdOn &&
                new Date(challenge.createdOn).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-700 dark:text-purple-400">
              <FaCheckCircle />{" "}
            </span>
            Accepted
            <span>
              {challenge.acceptedOn &&
                new Date(challenge.acceptedOn).toLocaleString()}
            </span>
          </div>
        </div>
      );
    }

    if (challenge.status === "completed") {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-purple-700 dark:text-purple-400">
              <FaCheckCircle />{" "}
            </span>
            Accepted
            <span>
              {challenge.acceptedOn &&
                new Date(challenge.acceptedOn).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-700 dark:text-green-400">
              <FaCheckCircle />{" "}
            </span>
            Completed
            <span>
              {challenge.completedOn &&
                new Date(challenge.completedOn).toLocaleString()}
            </span>
          </div>
        </div>
      );
    }

    if (challenge.status === "failed") {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-purple-700 dark:text-purple-400">
              <FaCheckCircle />{" "}
            </span>
            Accepted
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-700 dark:text-rose-400">
              <FaTimesCircle />{" "}
            </span>
            Taking a Break
          </div>
        </div>
      );
    }
  }

  if (lab.id !== challenge.labId) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between border-t border-slate-500 pt-4">
      <div className="flex h-fit items-center gap-4">
        <ProfileDisplay profile={challengerProfile} />
        {createdByProfile && <div className="text-xl">💪 Challenged By</div>}
        {createdByProfile && <ProfileDisplay profile={createdByProfile} />}
      </div>
      <div className="flex items-center gap-2">{renderStatus(challenge)}</div>
      {challenge.userId === myProfile?.userPrincipal &&
        challenge.status === "created" && (
          <Button
            variant="primary"
            tooltipMessage="Accept the challenge to start working on it."
            onClick={() => {
              challenge.status = "accepted";
              challenge.acceptedOn = new Date().toISOString();
              upsertChallenge([challenge]);
            }}
          >
            <FaTrophy /> Accept Challenge
          </Button>
        )}
      {/* {challenge.createdBy === myProfile?.userPrincipal &&
				challenge.status !== "completed" &&
				challenge.status !== "created" && (
					<Button
						variant="primary-text"
						tooltipMessage="Mark completed once your challenger solves the problem and Validation looks good."
						onClick={onCompleteChallenge}
					>
						<FaCheckCircle /> Mark Completed
					</Button>
				)} */}
      {(challenge.userId === myProfile?.userPrincipal ||
        challenge.createdBy === myProfile?.userPrincipal) && (
        <Button
          variant="danger-icon"
          onClick={() => onDeleteChallenge(challengerProfile)}
        >
          <FaTrash />
        </Button>
      )}
      {showConfirmDeleteModal && (
        <ConfirmationModal
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={onConfirmDeleteChallenge}
          title={"Confirm Delete Challenge"}
        >
          <p>
            Are you sure you want to delete this challenge for{" "}
            <strong>
              {challengeToBeDeleted.displayName ||
                challengeToBeDeleted.userPrincipal}
            </strong>
            ? Not only they will lose access to the lab, their progress and
            credits will be lost irreversibly.
          </p>
        </ConfirmationModal>
      )}
      {showConfirmCompleteModal && (
        <ConfirmationModal
          onClose={() => setShowConfirmCompleteModal(false)}
          onConfirm={onConfirmCompleteChallenge}
          title={"Confirm Delete Challenge"}
        >
          <p>
            Are you sure you want to mark this challenge complete for{" "}
            <strong>
              {challengeToBeDeleted.displayName ||
                challengeToBeDeleted.userPrincipal}
            </strong>
            ? This is not reversible.
          </p>
        </ConfirmationModal>
      )}
    </div>
  );
}

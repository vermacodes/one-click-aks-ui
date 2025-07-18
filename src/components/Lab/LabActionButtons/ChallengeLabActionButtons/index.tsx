import { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaTimes } from "react-icons/fa";
import { ButtonContainerObj, Lab } from "../../../../dataStructures";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import ApplyButton from "../../../Terraform/ActionButtons/ApplyButton";
import DestroyButton from "../../../Terraform/ActionButtons/DestroyButton";
import ExtendButton from "../../../Terraform/ActionButtons/ExtendButton";
import CopyLinkToLabButton from "../../CopyLinkToLabButton";
import DeleteLabButton from "../../DeleteLabButton";
import LoadToBuilderButton from "../../LoadToBuilderButton";
import PublishLabButton from "../../PublishLabButton";
import ButtonContainer from "../ButtonContainer";

type Props = {
  lab: Lab;
};

export default function ChallengeLabActionButtons({ lab }: Props) {
  const { data: profile } = useGetMyProfile();
  const [buttons, setButtons] = useState<Record<string, ButtonContainerObj>>(
    {},
  );
  const [overflowButtons, setOverflowButtons] = useState<
    Record<string, ButtonContainerObj>
  >({});

  useEffect(() => {
    const initialButtons: Record<string, ButtonContainerObj> = {
      loadToBuilderButton: {
        id: "loadToBuilderButton",
        order: 1,
        button: (
          <LoadToBuilderButton
            key={"loadToBuilderButton"}
            lab={lab}
            variant="primary-text"
          >
            Open in Builder
          </LoadToBuilderButton>
        ),
      },
      deployButton: {
        id: "deployButton",
        order: 2,
        button: (
          <ApplyButton key={"deployButton"} lab={lab} variant="primary-text">
            Deploy
          </ApplyButton>
        ),
      },
      validateLabButton: {
        id: "validateLabButton",
        order: 3,
        button: (
          <ExtendButton
            key={"validateLabButton"}
            lab={lab}
            variant="success-text"
            mode="extend-validate"
          >
            <FaCheck /> Validate
          </ExtendButton>
        ),
      },
      destroyButton: {
        id: "destroyButton",
        order: 4,
        button: (
          <DestroyButton key={"destroyButton"} lab={lab} variant="danger-text">
            Destroy
          </DestroyButton>
        ),
      },
      publishLabBUtton: {
        id: "shareLabButton",
        order: 5,
        button: (
          <PublishLabButton
            key={"shareLabButton"}
            lab={lab}
            variant="secondary-text"
          >
            <span>{lab.isPublished ? <FaTimes /> : <FaCheck />}</span>
            {lab.isPublished ? "Unpublish" : "Publish"}
          </PublishLabButton>
        ),
      },
      shareLabButton: {
        id: "shareLabButton",
        order: 6,
        button: (
          <CopyLinkToLabButton
            key={"shareLabButton"}
            lab={lab}
            variant="secondary-text"
          >
            <span>
              <FaCopy />
            </span>
            Link to Lab
          </CopyLinkToLabButton>
        ),
      },
      shareChallengeButton: {
        id: "shareChallengeButton",
        order: 7,
        button: (
          <CopyLinkToLabButton
            key={"shareChallengeButton"}
            lab={lab}
            labType="challenge"
            variant="secondary-text"
          >
            <span>
              <FaCopy />
            </span>
            Link to Challenge
          </CopyLinkToLabButton>
        ),
      },
    };

    setButtons(initialButtons);
  }, [lab]);

  function upsertButton(button: ButtonContainerObj) {
    if (overflowButtons[button.id]) {
      setOverflowButtons((prevOverflowButtons) => {
        return { ...prevOverflowButtons, [button.id]: button };
      });
      //add some delay do avoid flickering. This is not the best solution.
      setTimeout(() => {}, 10);
      return;
    }

    setButtons((prevButtons) => {
      return { ...prevButtons, [button.id]: button };
    });
  }

  function deleteButton(buttonId: string) {
    setButtons((prevButtons) => {
      const { [buttonId]: _, ...remainingButtons } = prevButtons;
      return remainingButtons;
    });
  }

  useEffect(() => {
    if (
      profile &&
      lab.owners !== null &&
      lab.owners.includes(profile.userPrincipal)
    ) {
      const deleteButton: ButtonContainerObj = {
        id: "deleteLabButton",
        order: 7,
        button: (
          <DeleteLabButton
            lab={lab}
            key={"deleteLabButton"}
            variant="danger-text"
          >
            Delete
          </DeleteLabButton>
        ),
      };

      upsertButton(deleteButton);
    } else {
      deleteButton("deleteLabButton");
    }
  }, [profile, lab]);

  return (
    <div className="flex flex-wrap justify-start gap-2">
      <ButtonContainer
        buttons={buttons}
        setButtons={setButtons}
        overflowButtons={overflowButtons}
        setOverflowButtons={setOverflowButtons}
      />
    </div>
  );
}

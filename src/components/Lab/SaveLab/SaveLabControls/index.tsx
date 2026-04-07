import { Lab } from "../../../../dataStructures";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import Container from "../../../UserInterfaceComponents/Container";
import ChallengeLabControls from "./ChallengeLabControls";

type Props = {
  lab: Lab;
  setLab: (lab: Lab) => void;
};

export default function SaveLabControls({ lab, setLab }: Props) {
  const { data: profile } = useGetMyProfile();

  if (profile === undefined) {
    return null;
  }

  return (
    <Container
      collapsible
      title="Lab Controls"
      additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
    >
      <div className="flex flex-wrap items-center space-x-4">
        {lab.type === "challengelab" && (
          <ChallengeLabControls lab={lab} setLab={setLab} />
        )}
      </div>
    </Container>
  );
}

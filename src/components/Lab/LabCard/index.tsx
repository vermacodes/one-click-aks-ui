import ReactHtmlParser from "html-react-parser";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lab, Profile } from "../../../dataStructures";
import { useGetAllProfilesRedacted } from "../../../hooks/useProfile";
import { decodeIfEncoded } from "../../../utils/helpers";
import ProfileDisplay from "../../Authentication/ProfileDisplay";
import Container from "../../UserInterfaceComponents/Container";
import ChallengeProfiles from "../Challenge/ChallengeProfiles";
import LabActionButtons from "../LabActionButtons/LabActionButtons";
import LabProfiles from "../LabProfiles";
import LabVersionsButton from "../LabVersions/LabVersionsButton";

type Props = {
  lab: Lab | undefined;
  fullPage?: boolean;
  showVersions?: boolean;
};

export default function LabCard({
  lab,
  fullPage = false,
  showVersions = false,
}: Props) {
  function renderBody() {
    if (lab === undefined) {
      return <></>;
    }
    return (
      <Container additionalContainerBodyClasses="flex h-fit w-full flex-col justify-between gap-4">
        <LabHeader lab={lab} showVersions={showVersions} />
        <LabCredits lab={lab} />
        <LabDescription lab={lab} fullPage={fullPage} />
        <LabTags tags={lab.tags} />
        {fullPage && (
          <>
            <LabActionButtons lab={lab} />
            <LabProfiles lab={lab} profileType="owners" />
            <LabProfiles lab={lab} profileType="editors" />
            {lab.category === "private" && (
              <LabProfiles lab={lab} profileType="viewers" />
            )}
            {(lab.type === "challengelab" || lab.type === "challenge") && (
              <ChallengeProfiles lab={lab} />
            )}
          </>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-400">{lab.id}</p>
      </Container>
    );
  }

  if (lab === undefined) {
    return <></>;
  }

  return fullPage ? (
    renderBody()
  ) : (
    <Link className="max-h-fit" to={"/lab/" + lab.type + "/" + lab.id}>
      {renderBody()}
    </Link>
  );
}

type LabHeaderProps = {
  lab: Lab;
  showVersions: boolean;
};

function LabHeader({ lab, showVersions }: LabHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h3 className="text-3xl whitespace-pre-line">{lab.name}</h3>
      {showVersions && <LabVersionsButton lab={lab} />}
    </div>
  );
}

type LabDescriptionProps = {
  lab: Lab;
  fullPage?: boolean;
};

function LabDescription({ lab, fullPage = false }: LabDescriptionProps) {
  return (
    <div
      className={`${
        !fullPage && "max-h-[180px]"
      } scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full dark:scrollbar-track-slate-900 dark:scrollbar-thumb-slate-700 overflow-x-hidden overflow-y-auto px-1`}
      tabIndex={fullPage ? -1 : 0}
    >
      {ReactHtmlParser(decodeIfEncoded(lab.description))}
    </div>
  );
}

type LabTagsProps = {
  tags: string[];
};

function LabTags({ tags }: LabTagsProps) {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 pb-4 dark:border-slate-700">
      {tags &&
        tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border px-3 py-1 text-xs selection:border-slate-300 dark:border-slate-700"
          >
            {tag}
          </span>
        ))}
    </div>
  );
}

type LabCreditsProps = {
  lab: Lab;
};

function LabCredits({ lab }: LabCreditsProps) {
  const [createdBy, setCreatedBy] = useState<Profile>({} as Profile);
  const [updatedBy, setUpdatedBy] = useState<Profile>({} as Profile);

  const { data: profiles } = useGetAllProfilesRedacted();

  useEffect(() => {
    if (profiles) {
      setCreatedBy(
        profiles.find((profile) => profile.userPrincipal === lab.createdBy) ||
          ({} as Profile),
      );
      setUpdatedBy(
        profiles.find((profile) => profile.userPrincipal === lab.updatedBy) ||
          ({} as Profile),
      );
    }
  }, [profiles, lab]);

  return (
    <div className="flex flex-row justify-between gap-y-1 text-xs text-slate-600 dark:text-slate-400">
      {lab.createdBy !== "" && lab.createdOn !== "" && lab.updatedBy == "" && (
        <div className="flex flex-col gap-1">
          <span>Created on {lab.createdOn}</span>
          <ProfileDisplay profile={createdBy} size="small" />
        </div>
      )}
      {lab.updatedBy !== "" && lab.updatedOn !== "" && (
        <div className="flex flex-col gap-1">
          <span>Updated on {lab.updatedOn}</span>
          <ProfileDisplay profile={updatedBy} size="small" />
        </div>
      )}
    </div>
  );
}

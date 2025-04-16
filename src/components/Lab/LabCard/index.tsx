import ReactHtmlParser from "html-react-parser";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lab, Profile } from "../../../dataStructures";
import { useGetAllProfilesRedacted } from "../../../hooks/useProfile";
import { decodeIfEncoded } from "../../../utils/helpers";
import ProfileDisplay from "../../Authentication/ProfileDisplay";
import ChallengeProfiles from "../Challenge/ChallengeProfiles";
import LabActionButtons from "../LabActionButtons/LabActionButtons";
import LabProfiles from "../LabProfiles";
import LabVersionsButton from "../LabVersions/LabVersionsButton";

type Props = {
	lab: Lab | undefined;
	fullPage?: boolean;
	showVersions?: boolean;
};

export default function LabCard({ lab, fullPage = false, showVersions = false }: Props) {
	function renderBody() {
		if (lab === undefined) {
			return <></>;
		}
		return (
			<div className="flex h-fit w-full flex-col justify-between gap-4 rounded bg-slate-50 p-4 shadow-md outline-1 outline-slate-400 hover:shadow-lg hover:outline hover:outline-sky-500 dark:bg-slate-900 dark:outline-slate-600 dark:hover:outline-sky-500">
				<LabHeader lab={lab} showVersions={showVersions} />
				<LabCredits lab={lab} />
				<LabDescription lab={lab} fullPage={fullPage} />
				<LabTags tags={lab.tags} />
				{/* {!fullPage && (
          <Button variant="primary-outline">
            <FaUpRightFromSquare />
            Open
          </Button>
        )} */}
				{fullPage && (
					<>
						<LabActionButtons lab={lab} />
						<LabProfiles lab={lab} profileType="owners" />
						<LabProfiles lab={lab} profileType="editors" />
						{lab.category === "private" && <LabProfiles lab={lab} profileType="viewers" />}
						{(lab.type === "challengelab" || lab.type === "challenge") && <ChallengeProfiles lab={lab} />}
					</>
				)}
				<p className="text-xs text-slate-500 dark:text-slate-400">{lab.id}</p>
			</div>
		);
	}

	if (lab === undefined) {
		return <></>;
	}

	return fullPage ? renderBody() : <Link to={"/lab/" + lab.type + "/" + lab.id}>{renderBody()}</Link>;
}

type LabHeaderProps = {
	lab: Lab;
	showVersions: boolean;
};

function LabHeader({ lab, showVersions }: LabHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="whitespace-pre-line text-3xl">{lab.name}</h3>
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
			} overflow-y-auto overflow-x-hidden px-1 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full dark:scrollbar-track-slate-900 dark:scrollbar-thumb-slate-700`}
			tabIndex={0}
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
		<div className="flex flex-wrap gap-x-1 gap-y-1  pb-4 dark:border-slate-700">
			{tags &&
				tags.map((tag) => (
					<span
						key={tag}
						className="rounded border px-3 py-1  text-xs selection:border-slate-300 dark:border-slate-700 "
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
			setCreatedBy(profiles.find((profile) => profile.userPrincipal === lab.createdBy) || ({} as Profile));
			setUpdatedBy(profiles.find((profile) => profile.userPrincipal === lab.updatedBy) || ({} as Profile));
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

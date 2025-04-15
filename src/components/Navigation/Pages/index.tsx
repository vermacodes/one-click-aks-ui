import { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import {
	FaBook,
	FaBookReader,
	FaChalkboardTeacher,
	FaChessKing,
	FaClipboard,
	FaFlask,
	FaList,
	FaPuzzlePiece,
	FaRocket,
	FaServer,
	FaShieldAlt,
	FaTools,
	FaTrophy,
	FaUser,
	FaUsers,
} from "react-icons/fa";
import { useGetMyProfile } from "../../../hooks/useProfile";
import NavItem from "../NavItem";
import NavParent from "../NavParent";

export default function Pages() {
	const [expanded, setExpanded] = useState<string>("");
	const { data: profile } = useGetMyProfile();

	return (
		<div
			className={`h-9/10 mt-2 flex w-full flex-col overflow-y-scroll border-b border-t border-slate-300 px-4 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full dark:border-slate-700 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400`}
		>
			<ul className="md:text-l flex w-full flex-col justify-start gap-1 py-2 text-sm lg:text-xl">
				<NavItem
					icon={<FaTools />}
					label="Lab Builder"
					to={"/builder"}
					toolTipMessage={"build or modify labs"}
					toolTipDirection="bottom"
				/>
				<NavItem
					icon={<FaRocket />}
					label="Deployments"
					to={"/deployments"}
					toolTipMessage={"manage multiple lab deployments"}
				/>
				<li>
					<div>
						<NavParent
							id="labs"
							expanded={expanded}
							setExpanded={setExpanded}
							childTos={[
								"/labs/privatelab",
								"/labs/publiclab",
								"/labs/challengelab",
								"/lab/privatelab",
								"/lab/publiclab",
								"/lab/challengelab",
							]}
						>
							<span>
								<FaFlask />
							</span>
							<span>Labs</span>
						</NavParent>
						{expanded == "labs" && (
							<ul className="md:text-l flex w-full flex-col justify-start gap-1 pt-1 text-sm lg:text-xl">
								<NavItem
									icon={<FaUser />}
									label="Private Labs"
									to={"/labs/privatelab"}
									toolTipMessage="Labs created by you or shared privately with you."
									depth={1}
								/>
								<NavItem
									icon={<FaUsers />}
									label="Public Labs"
									to={"/labs/publiclab"}
									toolTipMessage="Publicly available labs created by SMEs."
									depth={1}
								/>
								<NavItem
									icon={<FaPuzzlePiece />}
									label="Challenge Labs"
									to={"/labs/challengelab"}
									toolTipMessage="Challenge labs created by you or shared privately with you. Looking for your challenges to solve? Go to Learning > My Challenges."
									depth={1}
								/>
							</ul>
						)}
					</div>
				</li>
				<li>
					<div>
						<NavParent
							id="learning"
							expanded={expanded}
							setExpanded={setExpanded}
							childTos={["/labs/challenge", "/lab/challenge", "/labs/assignment", "/my/assignments", "/lab/assignment"]}
						>
							<span>
								<FaBookReader />
							</span>
							<span>Learning</span>
						</NavParent>
						{expanded == "learning" && (
							<ul className="md:text-l flex w-full flex-col justify-start gap-1 pt-1 text-sm lg:text-xl">
								<NavItem
									icon={<FaTrophy />}
									label="Challenges"
									to={"/labs/challenge"}
									toolTipMessage="Challenges by your friends. Solve them to learn new skills."
									depth={1}
								/>
								<NavItem
									icon={<FaBookReader />}
									label="Readiness Labs"
									to={"/labs/assignment"}
									toolTipMessage="Labs assigned to you by your mentor or yourself for mandatory learning."
									depth={1}
								/>
								<NavItem
									icon={<FaList />}
									label="Assignments"
									to={"/my/assignments"}
									toolTipMessage="Manage your readiness labs assignments."
									depth={1}
								/>
							</ul>
						)}
					</div>
				</li>
				{profile && profile.roles.includes("mentor") && (
					<li>
						<div>
							<NavParent
								id="mentor"
								expanded={expanded}
								setExpanded={setExpanded}
								childTos={[
									"/labs/mockcase",
									"/lab/mockcase",
									"/labs/readinesslab",
									"/lab/readinesslab",
									"/assignments",
								]}
							>
								<span>
									<FaChalkboardTeacher />
								</span>
								<span>Mentor</span>
							</NavParent>
							{expanded == "mentor" && (
								<ul className="md:text-l flex w-full flex-col justify-start gap-1 pt-1 text-sm lg:text-xl">
									{" "}
									<NavItem
										icon={<FaClipboard />}
										label="Mock Cases"
										to={"/labs/mockcase"}
										toolTipMessage="View, create, manage and deploy mock cases for your mentees."
										depth={1}
									/>
									<NavItem
										icon={<FaBookReader />}
										label="Readiness Labs"
										to={"/labs/readinesslab"}
										toolTipMessage="View, create, and manage readiness labs. For assignments, Go to Mentor > All Assignments."
										depth={1}
									/>
									<NavItem
										icon={<FaList />}
										label="All Assignments"
										to={"/assignments"}
										toolTipMessage="Manage Readiness Labs assignments for your mentees."
										depth={1}
									/>
								</ul>
							)}
						</div>
					</li>
				)}
				{profile && profile.roles.includes("admin") && (
					<li>
						<div>
							<NavParent
								id="admin"
								expanded={expanded}
								setExpanded={setExpanded}
								childTos={["/rbac", "/managed-servers"]}
							>
								<span>
									<FaChessKing />
								</span>
								<span>Admin</span>
							</NavParent>
							{expanded == "admin" && (
								<ul className="md:text-l flex w-full flex-col justify-start gap-1 pt-1 text-sm lg:text-xl">
									{" "}
									<NavItem
										icon={<FaShieldAlt />}
										label="Access Control"
										to={"/rbac"}
										toolTipMessage="Manage access control for ACT Labs. Only Admins can access this page."
										depth={1}
									/>
									<NavItem
										icon={<FaServer />}
										label="Managed Servers"
										to={"/managed-servers"}
										toolTipMessage="Manage managed servers."
										depth={1}
									/>
								</ul>
							)}
						</div>
					</li>
				)}
				<li>
					<a
						target="_blank"
						className="flex h-full w-full items-center justify-start gap-2 rounded px-4 py-3 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800"
						type="button"
						href="https://aka.ms/actlabs-docs"
					>
						<span>
							<FaBook />
						</span>
						<span>Documentation</span>
						<span>
							<BsArrowUpRight />
						</span>
					</a>
				</li>
			</ul>
		</div>
	);
}

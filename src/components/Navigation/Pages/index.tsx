import { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import {
  FaBook,
  FaBookReader,
  FaChalkboardTeacher,
  FaChessKing,
  FaChevronRight,
  FaClipboard,
  FaFlask,
  FaList,
  FaPuzzlePiece,
  FaRocket,
  FaServer,
  FaShieldAlt,
  FaSuperpowers,
  FaTools,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useGetMyProfile } from "../../../hooks/useProfile";
import NavItem from "../NavItem";

export default function Pages() {
	const [expanded, setExpanded] = useState<string>("");
	const { data: profile } = useGetMyProfile();
	return (
		<div className="h-9/10 mt-2 flex w-full flex-col overflow-y-scroll border-b border-slate-300 px-4 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full dark:border-slate-700 dark:scrollbar-thumb-slate-600">
			<ul className="md:text-l flex w-full flex-col justify-start gap-2 py-2 text-sm lg:text-xl">
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
						<button
							className={`
                ${expanded === "labs" && "bg-slate-200 dark:bg-slate-800 "}
                flex h-full w-full items-center justify-between gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800`}
							onClick={() => {
								setExpanded(expanded == "labs" ? "" : "labs");
							}}
						>
							<div className="flex items-center gap-1">
								<span>
									<FaFlask />
								</span>
								<span>Labs</span>
							</div>
							<div className={`${expanded === "labs" && "rotate-90 "} transition-all`}>
								<FaChevronRight />
							</div>
						</button>
						{expanded == "labs" && (
							<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 py-2 text-sm lg:text-xl">
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
						<button
							className={`
                ${expanded === "learning" && "bg-slate-200 dark:bg-slate-800 "}
                flex h-full w-full items-center justify-between gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800`}
							onClick={() => {
								setExpanded(expanded == "learning" ? "" : "learning");
							}}
						>
							<div className="flex items-center gap-1">
								<span>
									<FaBookReader />
								</span>
								<span>Learning</span>
							</div>
							<div className={`${expanded === "learning" && "rotate-90 "} transition-all`}>
								<FaChevronRight />
							</div>
						</button>
						{expanded == "learning" && (
							<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 py-2 text-sm lg:text-xl">
								<NavItem
									icon={<FaSuperpowers />}
									label="My Challenges"
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
							<button
								className={`
                ${expanded === "mentor" && "bg-slate-200 dark:bg-slate-800 "}
                flex h-full w-full items-center justify-between gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800`}
								onClick={() => {
									setExpanded(expanded == "mentor" ? "" : "mentor");
								}}
							>
								<div className="flex items-center gap-1">
									<span>
										<FaChalkboardTeacher />
									</span>
									<span>Mentor</span>
								</div>
								<div className={`${expanded === "mentor" && "rotate-90 "} transition-all`}>
									<FaChevronRight />
								</div>
							</button>
							{expanded == "mentor" && (
								<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 py-2 text-sm lg:text-xl">
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
							<button
								className={`
              ${expanded === "admin" && "bg-slate-200 dark:bg-slate-800 "}
              flex h-full w-full items-center justify-between gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800`}
								onClick={() => {
									setExpanded(expanded == "admin" ? "" : "admin");
								}}
							>
								<div className="flex items-center gap-1">
									<span>
										<FaChessKing />
									</span>
									<span>Admin</span>
								</div>
								<div className={`${expanded === "admin" && "rotate-90 "} transition-all`}>
									<FaChevronRight />
								</div>
							</button>
							{expanded == "admin" && (
								<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 py-2 text-sm lg:text-xl">
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
						href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280599/ACT-Lab-Tool"
					>
						<button className="flex h-full w-full items-center justify-start gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800">
							<span>
								<FaBook />
							</span>
							<span>ACT Labs Docs</span>
							<span>
								<BsArrowUpRight />
							</span>
						</button>
					</a>
				</li>
			</ul>
		</div>
	);
}

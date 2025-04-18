import {
  FaBook,
  FaBookReader,
  FaChalkboardTeacher,
  FaChessKing,
  FaClipboard,
  FaCog,
  FaComments,
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
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import { useGetMyProfile } from "../../../hooks/useProfile";
import NavItem from "../NavItem";
import NavParent from "../NavParent";

export default function Pages() {
  const { navbarExpandedParent, setNavbarExpandedParent } =
    useGlobalStateContext();
  const { data: profile } = useGetMyProfile();

  return (
    <div
      className={`flex w-full flex-col overflow-hidden scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full dark:border-slate-700 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400`}
    >
      <ul className="md:text-l flex w-full flex-col justify-start gap-1 px-[2px] py-[2px] text-sm lg:text-xl">
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
              expanded={navbarExpandedParent}
              setExpanded={setNavbarExpandedParent}
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
            {navbarExpandedParent == "labs" && (
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
              expanded={navbarExpandedParent}
              setExpanded={setNavbarExpandedParent}
              childTos={[
                "/labs/challenge",
                "/lab/challenge",
                "/labs/assignment",
                "/my/assignments",
                "/lab/assignment",
              ]}
            >
              <span>
                <FaBookReader />
              </span>
              <span>Learning</span>
            </NavParent>
            {navbarExpandedParent == "learning" && (
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
                expanded={navbarExpandedParent}
                setExpanded={setNavbarExpandedParent}
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
              {navbarExpandedParent == "mentor" && (
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
                expanded={navbarExpandedParent}
                setExpanded={setNavbarExpandedParent}
                childTos={["/rbac", "/managed-servers"]}
              >
                <span>
                  <FaChessKing />
                </span>
                <span>Admin</span>
              </NavParent>
              {navbarExpandedParent == "admin" && (
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
        <NavItem
          icon={<FaBook />}
          label="Documentation"
          to={"https://aka.ms/actlabs-docs"}
          externalLink={true}
          toolTipMessage="Documentation for ACT Labs. Click to open in a new tab."
          toolTipDirection="bottom"
        />
        <NavItem
          icon={<FaCog />}
          label="Settings"
          to={"/settings"}
          toolTipMessage="Manage actlabs configurations and Your server."
        />
        <NavItem
          icon={<FaComments />}
          label="Help & Feedback"
          to={
            "https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyB_Mn8cPhhPoGtsF2A-X8pUQ1FUNTMwVDdTNUFEMllYWFUwSllYWFMyVy4u"
          }
          externalLink={true}
          toolTipMessage="Need help or have feedback? Please fill out the form and we will get back to you."
        />
        {/* <li>
					<LoginButton />
				</li> */}
      </ul>
    </div>
  );
}

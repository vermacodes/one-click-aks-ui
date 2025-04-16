import { Route, Routes } from "react-router-dom";
import CookiesConsent from "../../components/Authentication/CookiesConcent";
import { useGlobalStateContext } from "../../components/Context/GlobalStateContext";
import Navbar from "../../components/Navigation/Navbar";
import Title from "../../components/Navigation/Title";
import { defaultScrollbarStyle } from "../../defaults";
import AccessControl from "../../pages/AccessControl";
import Assignments from "../../pages/Assignments";
import Deployments from "../../pages/Deployments";
import Feedback from "../../pages/Feedback";
import LabBuilder from "../../pages/LabBuilder";
import LabPage from "../../pages/LabPage";
import LabVersionsPage from "../../pages/LabVersionsPage";
import LabsGridPage from "../../pages/LabsGridPage";
import Landing from "../../pages/Landing";
import ManagedServers from "../../pages/ManagedServers";
import MyAssignments from "../../pages/MyAssignments";
import SaveLabPage from "../../pages/SaveLabPage";
import Settings from "../../pages/Settings";

export default function MainLayout() {
	const { navbarOpen, setNavbarOpen } = useGlobalStateContext();
	return (
		<div className="flex h-screen overflow-hidden">
			<a
				href="#main"
				className="absolute -left-full z-50 transform bg-black p-4 text-white opacity-0 focus:left-1/2 focus:-translate-x-1/2 focus:opacity-100"
			>
				Skip to main content
			</a>
			{navbarOpen && (
				<div
					className={`left-0 top-0 h-screen w-screen min-w-fit overflow-x-hidden overflow-y-hidden md:w-1/6`}
					role="sidebar"
				>
					<Title />
					<Navbar />
				</div>
			)}
			<main
				id="main"
				role="main"
				aria-label="Main content"
				className={`flex-1 overflow-auto bg-slate-200 dark:bg-slate-800 ${defaultScrollbarStyle} md:px-4`}
			>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/builder" element={<LabBuilder />} />
					<Route path="/deployments" element={<Deployments />} />
					<Route path="/lab/:type/:id" element={<LabPage />} />
					<Route path="/lab/save" element={<SaveLabPage />} />
					<Route path="/lab/versions/:type/:id" element={<LabVersionsPage />} />
					<Route path="/labs/:type" element={<LabsGridPage />} />
					<Route path="/assignments" element={<Assignments />} />
					<Route path="/my/assignments" element={<MyAssignments />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/rbac" element={<AccessControl />} />
					<Route path="/managed-servers" element={<ManagedServers />} />
					<Route path="/feedback" element={<Feedback />} />
				</Routes>
			</main>
			<CookiesConsent />
		</div>
	);
}

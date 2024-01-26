import { Route, Routes } from "react-router-dom";
import CookiesConsent from "../../components/Authentication/CookiesConcent";
import { useGlobalStateContext } from "../../components/Context/GlobalStateContext";
import Navbar from "../../components/Navigation/Navbar";
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
import Settings from "../../pages/Settings";

export default function MainLayout() {
	const { navbarOpen, setNavbarOpen } = useGlobalStateContext();
	return (
		<div className="flex h-screen overflow-hidden">
			{navbarOpen && (
				<div
					className={`left-0 top-0 h-screen w-screen min-w-fit overflow-y-auto overflow-x-hidden ${defaultScrollbarStyle} md:w-1/6`}
				>
					<Navbar />
				</div>
			)}
			<div className={`flex-1 overflow-auto bg-slate-200 dark:bg-slate-800 ${defaultScrollbarStyle} md:px-4`}>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/builder" element={<LabBuilder />} />
					<Route path="/deployments" element={<Deployments />} />
					<Route path="/lab/:type/:id" element={<LabPage />} />
					<Route path="/lab/versions/:type/:id" element={<LabVersionsPage />} />
					<Route path="/labs/:type" element={<LabsGridPage />} />
					<Route path="/assignments" element={<Assignments />} />
					<Route path="/my/assignments" element={<MyAssignments />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/rbac" element={<AccessControl />} />
					<Route path="/managed-servers" element={<ManagedServers />} />
					<Route path="/feedback" element={<Feedback />} />
				</Routes>
			</div>
			<CookiesConsent />
		</div>
	);
}

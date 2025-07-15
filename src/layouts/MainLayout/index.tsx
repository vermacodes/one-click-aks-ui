import { Route, Routes } from "react-router-dom";
import CookiesConsent from "../../components/Authentication/CookiesConcent";
import { useGlobalStateContext } from "../../components/Context/GlobalStateContext";
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
import HeaderLayout from "../HeaderLayout/Header";
import Navbar from "../NavigationLayout/Navbar";

export default function MainLayout() {
  const { navbarOpen, viewportWidth } = useGlobalStateContext();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      <a
        href="#main"
        className="absolute -left-full z-50 transform p-4 opacity-0 focus:left-1/2 focus:-translate-x-1/2 focus:opacity-100"
      >
        Skip to main content
      </a>
      <HeaderLayout />
      <div className="flex h-[90%] overflow-hidden lg:h-[90%]">
        {navbarOpen && <Navbar />}

        {/** if screen width is less that 768px and navbar is open, don't show main content*/}
        {(!navbarOpen || viewportWidth >= 768) && (
          <main
            id="main"
            role="main"
            aria-label="Main content"
            className={`flex-1 overflow-auto overflow-x-hidden ${defaultScrollbarStyle} px-4`}
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/builder" element={<LabBuilder />} />
              <Route path="/deployments" element={<Deployments />} />
              <Route path="/lab/:type/:id" element={<LabPage />} />
              <Route path="/lab/save" element={<SaveLabPage />} />
              <Route
                path="/lab/versions/:type/:id"
                element={<LabVersionsPage />}
              />
              <Route path="/labs/:type" element={<LabsGridPage />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/my/assignments" element={<MyAssignments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/rbac" element={<AccessControl />} />
              <Route path="/managed-servers" element={<ManagedServers />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>
        )}
        <CookiesConsent />
      </div>
    </div>
  );
}

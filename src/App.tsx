import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootErrorBoundary from "./components/ErrorBoundaries/RootErrorBoundary";
import ServerNotification from "./components/ServerNotification";
import { useGlobalStateContext } from "./context/GlobalStateContext";
import MainLayout from "./layouts/MainLayout";
import { AppProviders } from "./providers/AppProviders";
import { cn } from "./utils/cn";

function App() {
  const { darkMode } = useGlobalStateContext();
  return (
    <div
      className={cn({
        dark: darkMode,
      })}
    >
      <AppProviders>
        <RootErrorBoundary>
          <MainLayout />
          <ToastContainer
            toastClassName={`${
              darkMode ? "bg-slate-200" : "bg-slate-800"
            } relative flex p-1 min-h-15 rounded-md justify-between overflow-hidden cursor-pointer contrast-more:border`}
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "light" : "dark"}
          />
          <ServerNotification />
        </RootErrorBoundary>
      </AppProviders>
    </div>
  );
}

export default App;

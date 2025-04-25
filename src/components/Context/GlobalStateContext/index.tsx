import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Lab, Theme } from "../../../dataStructures";
import { getDefaultLab } from "../../../defaults";
import { useLab, useSetLab } from "../../../hooks/useLab";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";

interface GlobalStateContextContextData {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  navbarOpen: boolean;
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewportWidth: number;
  setViewportWidth: React.Dispatch<React.SetStateAction<number>>;
  navbarExpandedParent: string;
  setNavbarExpandedParent: React.Dispatch<React.SetStateAction<string>>;
  lab: Lab;
  setLab: React.Dispatch<React.SetStateAction<Lab>>;
  syncLab: boolean;
  setSyncLab: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalStateContextContext = createContext<
  GlobalStateContextContextData | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

export function GlobalStateContextProvider({ children }: Props) {
  const [theme, setTheme] = useLocalStorageState<Theme>("theme", "system");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const isSystemDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return theme === "dark"
      ? true
      : theme === "light"
        ? false
        : isSystemDarkMode;
  });
  const [navbarOpen, setNavbarOpen] = useLocalStorageState<boolean>(
    "navbarOpen",
    true,
  );
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [navbarExpandedParent, setNavbarExpandedParent] =
    useLocalStorageState<string>("navbarExpandedParent", "");
  const [lab, setLab] = useState<Lab>(getDefaultLab());
  const [syncLab, setSyncLab] = useState<boolean>(true);
  const { mutate: setLabServerState } = useSetLab();
  const { data: labFromServer } = useLab();

  const previousWidthRef = useRef(window.innerWidth);

  /**
   * Update `darkMode` when `theme` changes.
   */
  useEffect(() => {
    const isSystemDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(
      theme === "dark" ? true : theme === "light" ? false : isSystemDarkMode,
    );
  }, [theme]);

  /**
   * Handle window resize events to update `viewportWidth` and toggle `navbarOpen`.
   */
  useEffect(() => {
    function handleResize() {
      const currentWidth = window.innerWidth;

      // Close the navbar if the screen crosses below 1280px
      if (currentWidth < 1280 && previousWidthRef.current >= 1280) {
        setNavbarOpen(false);
      }

      // Open the navbar if the screen crosses above 1280px
      if (currentWidth >= 1280 && previousWidthRef.current < 1280) {
        setNavbarOpen(true);
      }

      // Update the ref with the current width
      previousWidthRef.current = currentWidth;

      // Update the viewport width state
      setViewportWidth(currentWidth);
    }

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Sync `lab` state with the server when `labFromServer` changes.
   */
  useEffect(() => {
    if (labFromServer !== undefined && syncLab) {
      setLab(labFromServer);
      setSyncLab(false);
    }
  }, [labFromServer]);

  /**
   * Update the server state when `lab` changes.
   */
  useEffect(() => {
    if (lab !== undefined && !syncLab) {
      setLabServerState(lab);
    }
  }, [lab]);

  return (
    <GlobalStateContextContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        setDarkMode,
        navbarOpen,
        setNavbarOpen,
        viewportWidth,
        setViewportWidth,
        navbarExpandedParent,
        setNavbarExpandedParent,
        lab,
        setLab,
        syncLab,
        setSyncLab,
      }}
    >
      {children}
    </GlobalStateContextContext.Provider>
  );
}

export function useGlobalStateContext() {
  const context = useContext(GlobalStateContextContext);
  if (!context) {
    throw new Error(
      "useGlobalStateContext must be used within an GlobalStateContextProvider",
    );
  }
  return context;
}

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Lab } from "../../../dataStructures";
import { getDefaultLab } from "../../../defaults";
import { useLab, useSetLab } from "../../../hooks/useLab";
import { setDefaultValuesInLocalStorage } from "../../../utils/helpers";

interface GlobalStateContextContextData {
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [navbarOpen, setNavbarOpen] = useState<boolean>(true);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [navbarExpandedParent, setNavbarExpandedParent] = useState<string>("");
  const [lab, setLab] = useState<Lab>(getDefaultLab());
  const [syncLab, setSyncLab] = useState<boolean>(true);
  const { mutate: setLabServerState } = useSetLab();
  const { data: labFromServer } = useLab();

  const previousWidthRef = useRef(window.innerWidth);

  /**
   * This useEffect hook is triggered once when the component mounts.
   * It sets default values in local storage for `darkMode` and `navbarOpen`.
   * If these values are already set in local storage, it updates the local state accordingly.
   */
  useEffect(() => {
    setDefaultValuesInLocalStorage();

    var darkModeFromLocalStorage = localStorage.getItem("darkMode");
    if (darkModeFromLocalStorage === null) {
      localStorage.setItem("darkMode", "false");
    } else {
      if (darkModeFromLocalStorage === "true") {
        setDarkMode(true);
      }
    }

    var navbarOpenFromLocalStorage = localStorage.getItem("navbarOpen");
    if (navbarOpenFromLocalStorage === null) {
      localStorage.setItem("navbarOpen", "true");
    } else {
      if (navbarOpenFromLocalStorage === "false") {
        setNavbarOpen(false);
      }
    }
  }, []);

  /**
   * This useEffect hook is triggered when `darkMode` changes.
   * It updates the `darkMode` value in local storage to reflect the new state.
   */
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  /**
   * This useEffect hook is triggered when `navbarOpen` changes.
   * It updates the `navbarOpen` value in local storage to reflect the new state.
   */
  useEffect(() => {
    localStorage.setItem("navbarOpen", navbarOpen.toString());
  }, [navbarOpen]);

  /**
   * This useEffect hook is triggered when the window is resized.
   * It updates the `viewportWidth` state with the new window width.
   * It also closes the navbar if the screen width is below 1280px
   * and opens the navbar if the screen width is above 1280px.
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
   * This useEffect hook is triggered when `navbarExpandedParent` changes.
   * It updates the `navbarExpandedParent` value in local storage to reflect the new state.
   */
  useEffect(() => {
    localStorage.setItem("navbarExpandedParent", navbarExpandedParent);
  }, [navbarExpandedParent]);

  /**
   * This useEffect hook is triggered when `labFromServer` changes.
   * If `labFromServer` is defined and `syncLab` is true, it updates the local `lab` state with the server state
   * and sets `syncLab` to false to prevent unnecessary updates in the future.
   */
  useEffect(() => {
    if (labFromServer !== undefined && syncLab) {
      setLab(labFromServer);
      setSyncLab(false);
    }
  }, [labFromServer]);

  /**
   * This useEffect hook is triggered when `lab` changes.
   * If `lab` is defined and `syncLab` is false, it updates the server state with the local `lab` state.
   * This ensures that any changes to the local `lab` state are persisted to the server state.
   */
  useEffect(() => {
    if (lab !== undefined && !syncLab) {
      setLabServerState(lab);
    }
  }, [lab]);

  return (
    <GlobalStateContextContext.Provider
      value={{
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

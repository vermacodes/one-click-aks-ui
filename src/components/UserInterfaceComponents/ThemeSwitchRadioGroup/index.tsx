import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { Theme } from "../../../dataStructures";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import Tooltip from "../Tooltip";

type RadioGroupProps = {
  tooltipMessage?: string;
  tooltipDelay?: number;
  radioSize?: "sm" | "md" | "lg";
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function ThemeSwitchRadioGroup({
  tooltipMessage,
  tooltipDelay,
  radioSize = "md",
  ...rest
}: RadioGroupProps) {
  const { theme, setTheme, darkMode, setDarkMode } = useGlobalStateContext();

  let heightAndWidth = "h-5 w-5 lg:h-6 lg:w-6";
  if (radioSize === "sm") {
    heightAndWidth = "h-3 w-3 lg:h-4 lg:w-4";
  } else if (radioSize === "lg") {
    heightAndWidth = "h-7 w-7 lg:h-8 lg:w-8";
  }

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  // if the theme is system, set darkMode to true if the system is in dark mode
  React.useEffect(() => {
    if (theme === "system") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(isDarkMode);
    } else {
      setDarkMode(theme === "dark");
    }
  }, [theme, setDarkMode]);

  // Listen for changes in the system theme
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, setDarkMode]);

  return (
    <Tooltip message={tooltipMessage} delay={tooltipDelay}>
      <div
        className={cn(
          "flex items-center gap-1 rounded-sm border border-slate-300 p-0.5 lg:p-1 dark:border-slate-600",
          getUIStateColors({}),
          "contrast-more:border-current",
        )}
        role="radiogroup"
      >
        <button
          role="radio"
          className={cn(
            "flex items-center justify-center rounded-full",
            heightAndWidth,
            getUIStateColors({
              colors:
                theme === "system" ? (darkMode ? "light" : "dark") : "default",
              selected: theme === "system",
              hover: true,
            }),
            theme === "system" && "contrast-more:border-2",
            "contrast-more:hover:border-2",
          )}
          tabIndex={0}
          aria-label="System Theme"
          aria-checked={theme === "system"}
          onClick={() => handleThemeChange("system")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault(); // Prevent default scrolling behavior for Space
              handleThemeChange("system");
            }
          }}
        >
          <FaComputer />
        </button>
        <button
          role="radio"
          className={cn(
            "flex items-center justify-center rounded-full",
            heightAndWidth,
            getUIStateColors({
              colors: theme === "light" ? "dark" : "default",
              selected: theme === "light",
              hover: true,
            }),
            theme === "light" && "contrast-more:border-2",
            "contrast-more:hover:border-2",
          )}
          onClick={() => handleThemeChange("light")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault(); // Prevent default scrolling behavior for Space
              handleThemeChange("light");
            }
          }}
          aria-checked={theme === "light"}
          tabIndex={0}
          aria-label="Light Theme"
        >
          <FaSun />
        </button>
        <button
          role="radio"
          className={cn(
            "flex items-center justify-center rounded-full",
            heightAndWidth,
            getUIStateColors({
              colors: theme === "dark" ? "light" : "default",
              selected: theme === "dark",
              hover: true,
            }),
            theme === "dark" && "contrast-more:border-2",
            "contrast-more:hover:border-2",
          )}
          onClick={() => handleThemeChange("dark")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault(); // Prevent default scrolling behavior for Space
              handleThemeChange("dark");
            }
          }}
          aria-checked={theme === "dark"}
          tabIndex={0}
          aria-label="Dark Theme"
        >
          <FaMoon />
        </button>
      </div>
    </Tooltip>
  );
}

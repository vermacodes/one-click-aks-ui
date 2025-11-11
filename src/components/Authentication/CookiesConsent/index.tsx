import { useCallback, useEffect, useRef, useState } from "react";
import { FaCheck, FaCog, FaTimes } from "react-icons/fa";
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_PREFERENCES_KEY,
  CookieType,
  DEFAULT_COOKIE_PREFERENCES,
} from "../../../constants/cookies";
import Button from "../../UserInterfaceComponents/Button";

interface CookiePreferences {
  [CookieType.ESSENTIAL]: boolean;
  [CookieType.ANALYTICS]: boolean;
}

export default function CookiesConsent() {
  const [showCookiesConsent, setShowCookiesConsent] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    DEFAULT_COOKIE_PREFERENCES,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const bannerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Check consent status on mount
  useEffect(() => {
    try {
      const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      const savedPreferences = localStorage.getItem(
        COOKIE_CONSENT_PREFERENCES_KEY,
      );

      if (!hasConsent) {
        setShowCookiesConsent(true);
      }

      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error("Error reading cookie consent from localStorage:", error);
      setShowCookiesConsent(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (showCookiesConsent && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [showCookiesConsent]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (showCookiesConsent || showPreferences)) {
        handleDecline();
      }
    };

    if (showCookiesConsent || showPreferences) {
      document.addEventListener("keydown", handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showCookiesConsent, showPreferences]);

  const saveConsent = useCallback((prefs: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
      localStorage.setItem(
        COOKIE_CONSENT_PREFERENCES_KEY,
        JSON.stringify(prefs),
      );

      // Dispatch custom event for other parts of the app
      window.dispatchEvent(
        new CustomEvent("cookieConsentUpdated", {
          detail: prefs,
        }),
      );
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const allAccepted = {
      [CookieType.ESSENTIAL]: true,
      [CookieType.ANALYTICS]: true,
    };

    setPreferences(allAccepted);
    saveConsent(allAccepted);
    setShowCookiesConsent(false);
    setShowPreferences(false);
  }, [saveConsent]);

  const handleAcceptSelected = useCallback(() => {
    saveConsent(preferences);
    setShowCookiesConsent(false);
    setShowPreferences(false);
  }, [preferences, saveConsent]);

  const handleDecline = useCallback(() => {
    // Only essential cookies
    const essentialOnly = {
      [CookieType.ESSENTIAL]: true,
      [CookieType.ANALYTICS]: false,
    };

    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
    setShowCookiesConsent(false);
    setShowPreferences(false);
  }, [saveConsent]);

  const handlePreferenceChange = useCallback(
    (type: CookieType, enabled: boolean) => {
      if (type === CookieType.ESSENTIAL) return; // Essential cookies can't be disabled

      setPreferences((prev) => ({
        ...prev,
        [type]: enabled,
      }));
    },
    [],
  );

  if (isLoading || !showCookiesConsent) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 z-40 bg-black/60 duration-300"
        aria-hidden="true"
      />

      {/* Cookie Banner */}
      <div
        ref={bannerRef}
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        aria-live="polite"
        className="animate-in slide-in-from-bottom fixed bottom-0 left-1/2 z-50 mx-4 mb-4 w-full max-w-2xl -translate-x-1/2 transform duration-300"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span role="img" aria-label="Cookie" className="text-3xl">
                🍪
              </span>
              <h2
                id="cookie-banner-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Cookie Preferences
              </h2>
            </div>
            <button
              ref={firstFocusableRef}
              onClick={handleDecline}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:bg-gray-800 dark:focus:ring-blue-400"
              aria-label="Decline all cookies"
            >
              <FaTimes className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Description */}
          <div id="cookie-banner-description" className="mb-6">
            <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
              We use cookies to enhance your experience, analyze site traffic,
              and provide personalized content. You can customize your
              preferences below.
            </p>
            {/* <a
              href="/privacy-policy"
              className="inline-flex items-center gap-1 rounded px-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Privacy Policy
              <FaExternalLinkAlt className="h-3 w-3" />
            </a> */}
          </div>

          {/* Preferences Panel */}
          {showPreferences && (
            <div className="animate-in slide-in-from-top mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 duration-200 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Cookie Categories
              </h3>

              <div className="space-y-4">
                {Object.entries(preferences).map(([type, enabled]) => (
                  <div
                    key={type}
                    className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="mr-4 flex-1">
                      <label
                        htmlFor={`cookie-${type}`}
                        className="block cursor-pointer text-sm font-medium text-gray-900 capitalize dark:text-white"
                      >
                        {type === CookieType.ESSENTIAL
                          ? "Essential (Required)"
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        {type === CookieType.ESSENTIAL &&
                          "Required for basic site functionality and cannot be disabled"}
                        {type === CookieType.ANALYTICS &&
                          "Help us understand how you use our site to improve user experience"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        id={`cookie-${type}`}
                        type="checkbox"
                        checked={enabled}
                        disabled={type === CookieType.ESSENTIAL}
                        onChange={(e) =>
                          handlePreferenceChange(
                            type as CookieType,
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5 rounded border-2 border-gray-300 bg-white text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <div className="flex flex-1 gap-3">
              <Button
                variant="secondary-outline"
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex-1"
                aria-expanded={showPreferences}
                aria-controls="cookie-preferences"
              >
                <FaCog className="h-4 w-4" />
                {showPreferences ? "Hide Options" : "Customize"}
              </Button>

              <Button
                variant="danger-outline"
                onClick={handleDecline}
                className="flex-1"
              >
                <FaTimes className="h-4 w-4" />
                Decline All
              </Button>
            </div>

            <Button
              variant="primary"
              onClick={showPreferences ? handleAcceptSelected : handleAcceptAll}
              className="min-w-[140px]"
            >
              <FaCheck className="h-4 w-4" />
              {showPreferences ? "Accept Selected" : "Accept All"}
            </Button>
          </div>

          {/* Footer */}
          {/* <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              You can change your preferences at any time in the{" "}
              <button
                onClick={() => (window.location.href = "/settings")}
                className="rounded px-1 font-medium text-blue-600 hover:text-blue-800 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-400"
              >
                settings page
              </button>
              .
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
}

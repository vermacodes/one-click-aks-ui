import { useCallback, useEffect, useState } from "react";
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_PREFERENCES_KEY,
  CookieType,
  DEFAULT_COOKIE_PREFERENCES,
} from "../constants/cookies";

interface CookiePreferences {
  [CookieType.ESSENTIAL]: boolean;
  [CookieType.ANALYTICS]: boolean;
}

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    DEFAULT_COOKIE_PREFERENCES,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load consent status and preferences
  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      const savedPreferences = localStorage.getItem(
        COOKIE_CONSENT_PREFERENCES_KEY,
      );

      setHasConsent(!!consent);

      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error("Error loading cookie consent:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update consent and preferences
  const updateConsent = useCallback((newPreferences: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
      localStorage.setItem(
        COOKIE_CONSENT_PREFERENCES_KEY,
        JSON.stringify(newPreferences),
      );

      setHasConsent(true);
      setPreferences(newPreferences);

      // Dispatch event for other parts of the app
      window.dispatchEvent(
        new CustomEvent("cookieConsentUpdated", {
          detail: newPreferences,
        }),
      );
    } catch (error) {
      console.error("Error updating cookie consent:", error);
    }
  }, []);

  // Clear consent (for testing or reset purposes)
  const clearConsent = useCallback(() => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      localStorage.removeItem(COOKIE_CONSENT_PREFERENCES_KEY);
      setHasConsent(false);
      setPreferences(DEFAULT_COOKIE_PREFERENCES);
    } catch (error) {
      console.error("Error clearing cookie consent:", error);
    }
  }, []);

  // Check if specific cookie type is enabled
  const isCookieEnabled = useCallback(
    (type: CookieType) => {
      return hasConsent && preferences[type];
    },
    [hasConsent, preferences],
  );

  return {
    hasConsent,
    preferences,
    isLoading,
    updateConsent,
    clearConsent,
    isCookieEnabled,
  };
}

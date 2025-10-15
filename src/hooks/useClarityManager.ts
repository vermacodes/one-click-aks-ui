import { useEffect } from "react";
import { CookieType } from "../constants/cookies";
import { useCookieConsent } from "./useCookieConsent";

// Type-safe Clarity loading function
const loadClarity = (clarityId: string) => {
  (function (c: any, l: Document, a: string, r: string, i: string) {
    let t: HTMLScriptElement;
    let y: Element;

    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityId);
};

// Update Clarity consent using the v2 API
const updateClarityConsent = (analyticsEnabled: boolean) => {
  if (window.clarity) {
    try {
      // Use the new consentv2 API
      window.clarity("consentv2", {
        ad_Storage: analyticsEnabled ? "granted" : "denied",
        analytics_Storage: analyticsEnabled ? "granted" : "denied",
      });
    } catch (error) {
      console.warn("Error updating Clarity consent:", error);
    }
  }
};

export const useClarityManager = () => {
  const { isCookieEnabled, isLoading } = useCookieConsent();

  useEffect(() => {
    // Don't run on localhost or dev environments
    if (
      window.location.host.includes("localhost") ||
      window.location.host.includes("dev") ||
      isLoading
    ) {
      return;
    }

    const analyticsEnabled = isCookieEnabled(CookieType.ANALYTICS);

    if (analyticsEnabled && !window.clarity) {
      // Load Clarity script if analytics is enabled and not already loaded
      loadClarity("k0tst770o6");
      // Set consent after loading
      setTimeout(() => updateClarityConsent(true), 100);
    } else if (window.clarity) {
      // Update consent status if Clarity is already loaded
      updateClarityConsent(analyticsEnabled);
    }
  }, [isCookieEnabled, isLoading]);

  // Listen for cookie consent changes
  useEffect(() => {
    const handleConsentUpdate = (event: CustomEvent) => {
      const preferences = event.detail;
      const analyticsEnabled = preferences[CookieType.ANALYTICS];

      if (analyticsEnabled && !window.clarity) {
        // Load Clarity if analytics consent is given and not already loaded
        loadClarity("k0tst770o6");
        // Set consent after loading
        setTimeout(() => updateClarityConsent(true), 100);
      } else if (window.clarity) {
        // Update consent if Clarity is already loaded
        updateClarityConsent(analyticsEnabled);

        // If consent is revoked, clear cookies and restart in no-consent mode
        if (!analyticsEnabled) {
          try {
            window.clarity("consent", false); // This erases cookies per the docs
          } catch (error) {
            console.warn("Error clearing Clarity cookies:", error);
          }
        }
      }
    };

    window.addEventListener(
      "cookieConsentUpdated",
      handleConsentUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "cookieConsentUpdated",
        handleConsentUpdate as EventListener,
      );
    };
  }, []);
};

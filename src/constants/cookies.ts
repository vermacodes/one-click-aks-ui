// Cookie consent constants
export const COOKIE_CONSENT_KEY = "cookies_consent";
export const COOKIE_CONSENT_PREFERENCES_KEY = "cookie_preferences";

// Cookie types for granular consent
export enum CookieType {
  ESSENTIAL = "essential",
  ANALYTICS = "analytics",
}

// Default cookie preferences
export const DEFAULT_COOKIE_PREFERENCES = {
  [CookieType.ESSENTIAL]: true, // Always required
  [CookieType.ANALYTICS]: false,
};

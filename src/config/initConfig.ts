// src/config/initConfig.ts
// Ensures essential config values are set in localStorage at app startup

const defaultBaseUrl =
  import.meta.env.VITE_ACTLABS_HUB_BASE_URL ||
  "https://app.msftactlabs.com/hub/";
const deprecatedEndpoints = [
  "https://actlabs-auth.azurewebsites.net",
  "https://actlabs-hub.eastus.azurecontainer.io",
  "https://actlabs-hub-capp.redisland-ff4b63ab.eastus.azurecontainerapps.io",
  "https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io/",
];

export function initConfig() {
  const baseUrlFromLocalStorage = localStorage.getItem("actlabsHubBaseUrl");

  // If missing or deprecated, set to default
  if (
    !baseUrlFromLocalStorage ||
    deprecatedEndpoints.some((ep) => baseUrlFromLocalStorage.includes(ep))
  ) {
    localStorage.setItem("actlabsHubBaseUrl", defaultBaseUrl);
  }

  // Set default theme if not set
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "system");
  }

  // Set default autoScroll if not set
  if (localStorage.getItem("autoScroll") === null) {
    localStorage.setItem("autoScroll", "true");
  }
}

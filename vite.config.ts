import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Fail build if required environment variables are not set
  const requiredEnvVars = ["VITE_ACTLABS_HUB_BASE_URL"];

  for (const envVar of requiredEnvVars) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    base: "/ui/",
  };
});

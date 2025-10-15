// Global type declarations
interface ClarityConsentV2 {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
}

declare global {
  interface Window {
    clarity?: {
      (action: string): void;
      (action: "consent"): void;
      (action: "consent", enabled: boolean): void;
      (action: "consentv2", consent: ClarityConsentV2): void;
      (action: "set", key: string, value: any): void;
      (action: "stop"): void;
      q?: any[];
    };
  }
}

export {};

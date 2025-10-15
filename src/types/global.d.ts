// Global type declarations
declare global {
  interface Window {
    clarity?: {
      (action: string): void;
      (action: "consent"): void;
      (action: "set", key: string, value: any): void;
    };
  }
}

export {};

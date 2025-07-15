import { useEffect, useState } from "react";

export const useLocalStorageState = <T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T; // Parse JSON if stored value is valid
      } catch {
        return storedValue as T; // Fallback to raw string if parsing fails
      }
    }
    return initialValue; // Use initial value if nothing is stored
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state)); // Store state as JSON
  }, [key, state]);

  return [state, setState];
};

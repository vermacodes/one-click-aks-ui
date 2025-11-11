import { useEffect, useState } from "react";

export function usePageVisibility() {
  const [isPageVisible, setPageVisible] = useState(!document.hidden);

  useEffect(() => {
    function handleVisibilityChange() {
      setPageVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isPageVisible;
}

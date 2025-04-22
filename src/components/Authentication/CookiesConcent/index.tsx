import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
import Button from "../../UserInterfaceComponents/Button";

declare global {
  interface Window {
    clarity: any;
  }
}

export default function CookiesConsent() {
  const [showCookiesConsent, setShowCookiesConsent] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies_consent")) {
      setShowCookiesConsent(true);
    }
  }, []);

  function onClickHandler() {
    localStorage.setItem("cookies_consent", "true");
    window.clarity("consent");
    setShowCookiesConsent(false);
  }

  return (
    <>
      {showCookiesConsent && (
        // setting background color to highlight
        <div
          className={cn(
            "fixed bottom-0 left-1/2 mb-4 flex -translate-x-1/2 flex-col gap-8 rounded-sm p-5",
            getUIStateColors({ inverted: true }),
          )}
        >
          <div className="flex items-center">
            <p className="flex items-center justify-center text-7xl">🍪</p>
            <p className="text-xl">
              This website uses cookies to enhance the user experience. By using
              this website, you consent to the use of cookies.
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="primary" onClick={() => onClickHandler()}>
              <FaCheck /> Accept
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

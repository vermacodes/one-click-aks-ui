import { useEffect, useRef } from "react";

type Props = {
  onClick(e: React.MouseEvent<HTMLDivElement>): void;
  children: React.ReactNode;
};

export default function ModalBackdrop({ onClick, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusableSelectors =
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    const focusableElements =
      modal?.querySelectorAll<HTMLElement>(focusableSelectors);

    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab: Move focus backward
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: Move focus forward
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Focus the first element when the modal opens
    firstElement?.focus();

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-20 flex max-h-full max-w-full justify-center bg-slate-950/80 dark:bg-slate-50/80"
      onClick={(e) => onClick(e)}
    >
      {children}
    </div>
  );
}

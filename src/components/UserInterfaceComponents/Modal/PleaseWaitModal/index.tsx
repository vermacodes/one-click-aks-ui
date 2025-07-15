import { useEffect, useRef } from "react";
import { getUIStateColors } from "../../../../defaults";
import { cn } from "../../../../utils/cn";
import ModalBackdrop from "../ModalBackdrop";

type ModalProps = {
  modalMessage: string;
};

export default function PleaseWaitModal({ modalMessage }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the modal when it opens
    modalRef.current?.focus();
  }, []);
  return (
    <ModalBackdrop onClick={(e) => e.stopPropagation()}>
      <div
        ref={modalRef}
        className={cn(
          "scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 my-20 h-2/3 w-2/3 items-center space-y-2 divide-y divide-slate-300 overflow-x-hidden overflow-y-auto rounded-sm p-5 lg:h-1/3 lg:w-1/3 dark:divide-slate-700",
          getUIStateColors({}),
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="dialog" // Set the role to dialog
        aria-label="Please wait dialog" // Set the aria-label for accessibility
        aria-describedby="dialogDescription" // Associate the content with the modal
        tabIndex={-1} // Make the modal focusable
      >
        <div
          id="dialogDescription"
          className="flex h-full w-full items-center justify-center text-2xl"
        >
          {modalMessage}
        </div>
      </div>
    </ModalBackdrop>
  );
}

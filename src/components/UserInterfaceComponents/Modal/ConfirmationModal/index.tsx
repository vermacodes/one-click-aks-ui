import { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { getUIStateColors } from "../../../../defaults";
import { cn } from "../../../../utils/cn";
import Button from "../../Button";
import ModalBackdrop from "../ModalBackdrop";

type ModalProps = {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  closeLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmationModal({
  title,
  onClose,
  onConfirm,
  closeLabel,
  confirmLabel,
  cancelLabel,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the modal when it opens
    modalRef.current?.focus();
  }, []);

  return (
    <ModalBackdrop
      key={"confirmDeleteModal"}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        className={cn(
          "h-fit max-h-[80vh] w-full max-w-[90vw] overflow-y-auto rounded-sm p-5 contrast-more:border sm:w-2/3 md:my-20 md:w-3/5",
          getUIStateColors({}),
        )}
        role="dialog" // Set the role to dialog
        aria-labelledby="dialogTitle" // Associate the title with the modal
        aria-describedby="dialogDescription" // Associate the content with the modal
        tabIndex={-1} // Make the modal focusable
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex w-full justify-between border-b-2 pb-2">
          <h1 id="dialogTitle" className="pb-2 text-3xl">
            {title}
          </h1>
          <button
            onClick={() => onClose()}
            className="hover:text-sky-500"
            aria-label={closeLabel ? closeLabel : "Close dialog"}
          >
            <MdClose className="text-3xl" />
          </button>
        </div>
        <div
          id="dialogDescription"
          className="flex min-w-full flex-col justify-between gap-y-12 py-4"
        >
          {children}
        </div>
        <div className="mt-4 flex justify-end gap-x-4">
          <Button
            variant="danger"
            onClick={() => onConfirm()}
            aria-label={confirmLabel ? confirmLabel : "Confirm action"}
          >
            🙂 Pretty Sure!
          </Button>
          <Button
            variant="primary"
            onClick={() => onClose()}
            aria-label={cancelLabel ? cancelLabel : "Cancel action"}
          >
            🤔 May Be Not!
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

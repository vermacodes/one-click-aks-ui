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
  return (
    <ModalBackdrop
      key={"confirmDeleteModal"}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={cn(
          "scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 h-fit max-h-[80vh] w-full max-w-[90vw] divide-y divide-slate-300 overflow-y-auto rounded-sm p-5 sm:w-2/3 md:my-20 md:w-3/5 dark:divide-slate-700",
          getUIStateColors({}),
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex w-full justify-between pb-2">
          <h1 className="text-3xl">{title}</h1>
          <button
            onClick={() => onClose()}
            className="hover:text-sky-500"
            aria-label={closeLabel ? closeLabel : "Close modal"}
          >
            <MdClose className="text-3xl" />
          </button>
        </div>
        <div className="flex min-w-full flex-col justify-between gap-y-12 pt-4">
          {children}
          <div className="flex justify-end gap-x-4">
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
      </div>
    </ModalBackdrop>
  );
}

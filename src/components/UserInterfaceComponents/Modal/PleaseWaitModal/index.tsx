import { getUIStateColors } from "../../../../defaults";
import { cn } from "../../../../utils/cn";
import ModalBackdrop from "../ModalBackdrop";

type ModalProps = {
  modalMessage: string;
};

export default function PleaseWaitModal({ modalMessage }: ModalProps) {
  return (
    <ModalBackdrop onClick={(e) => e.stopPropagation()}>
      <div
        className={cn(
          "scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 my-20 h-2/3 w-2/3 items-center space-y-2 divide-y divide-slate-300 overflow-x-hidden overflow-y-auto rounded-sm p-5 lg:h-1/3 lg:w-1/3 dark:divide-slate-700",
          getUIStateColors({}),
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex h-full w-full items-center justify-center text-2xl">
          {modalMessage}
        </div>
      </div>
    </ModalBackdrop>
  );
}

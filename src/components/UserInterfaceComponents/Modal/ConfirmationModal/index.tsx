import { MdClose } from "react-icons/md";
import Button from "../../Button";
import ModalBackdrop from "../ModalBackdrop";

type ModalProps = {
	title: string;
	onClose: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
};

export default function ConfirmationModal({ title, onClose, onConfirm, children }: ModalProps) {
	return (
		<ModalBackdrop key={"confirmDeleteModal"} onClick={(e) => e.stopPropagation()}>
			<div
				className="h-fit max-h-[80vh] w-full max-w-[90vw] divide-y divide-slate-300 overflow-y-auto rounded-sm bg-slate-100 p-5 scrollbar-thin scrollbar-thumb-slate-400 dark:divide-slate-700 dark:bg-slate-900 dark:scrollbar-thumb-slate-600 sm:w-2/3 md:my-20 md:w-3/5"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="flex w-full justify-between pb-2">
					<h1 className="text-3xl">{title}</h1>
					<button onClick={() => onClose()} className="hover:text-sky-500">
						<MdClose className="text-3xl" />
					</button>
				</div>
				<div className="flex min-w-full flex-col justify-between gap-y-12 pt-4">
					{children}
					<div className="flex justify-end gap-x-4">
						<Button variant="danger" onClick={() => onConfirm()}>
							🙂 Pretty Sure!
						</Button>
						<Button variant="primary" onClick={() => onClose()}>
							🤔 May Be Not!
						</Button>
					</div>
				</div>
			</div>
		</ModalBackdrop>
	);
}

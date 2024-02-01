type ModalProps = {
	modalMessage: string;
};

export default function PleaseWaitModal({ modalMessage }: ModalProps) {
	return (
		<div className="fixed inset-0 z-20 flex max-h-full max-w-full justify-center bg-slate-800 bg-opacity-80 dark:bg-slate-100 dark:bg-opacity-80">
			<div
				className="my-20 h-1/3 w-1/3 items-center space-y-2 divide-y divide-slate-300 overflow-y-auto overflow-x-hidden rounded bg-slate-100 p-5 scrollbar-thin  scrollbar-thumb-slate-400 dark:divide-slate-700 dark:bg-slate-900 dark:scrollbar-thumb-slate-600"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="flex h-full w-full items-center justify-center text-2xl">{modalMessage}</div>
			</div>
		</div>
	);
}

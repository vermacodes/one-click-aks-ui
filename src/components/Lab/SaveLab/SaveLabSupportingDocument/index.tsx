type Props = {
	supportingDocument: File | null;
	setSupportingDocument(args: File): void;
};

export default function SaveLabSupportingDocument({ supportingDocument, setSupportingDocument }: Props) {
	const handlePdfAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSupportingDocument(e.target.files[0]);
		}
	};

	return (
		<>
			<div className="flex flex-col ">
				<label htmlFor="labName" className="flex flex-col text-lg">
					Supporting Documents
					<span className="mb-2 text-sm italic text-gray-500">
						Optional PDF Format Document only. You can add supporting documents in addition to the description of the
						lab.
					</span>
				</label>
				<input
					className="rounded border border-slate-500 bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
					id="pdfAttachment"
					type="file"
					accept="application/pdf"
					onChange={(e) => handlePdfAttachmentChange(e)}
				/>
			</div>
		</>
	);
}

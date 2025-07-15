import { FaTimes } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Lab } from "../../../../dataStructures";
import { useDeleteSupportingDocument } from "../../../../hooks/useBlobs";
import Button from "../../../UserInterfaceComponents/Button";
import DownloadButton from "../../SupportingDocuments/DownloadButton";

type Props = {
	lab: Lab;
	setLab: (lab: Lab) => void;
	supportingDocument: File | null;
	setSupportingDocument(args: File): void;
};

export default function SaveLabSupportingDocument({ lab, setLab, supportingDocument, setSupportingDocument }: Props) {
	const { mutateAsync: deleteSupportingDocument } = useDeleteSupportingDocument();

	const handleDeleteSupportingDocument = async () => {
		try {
			const deletePromise = deleteSupportingDocument(lab.supportingDocumentId);

			await toast.promise(deletePromise, {
				pending: "Deleting supporting document...",
				success: "Supporting document deleted.",
				error: "Failed to delete supporting document.",
			});

			// Update the lab state only if the delete operation is successful
			setLab({ ...lab, supportingDocumentId: "" });
		} catch (error) {
			toast.error(`Failed to delete supporting document`);
		}
	};

	const handlePdfAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSupportingDocument(e.target.files[0]);
		}
	};

	if (lab.supportingDocumentId !== "") {
		return (
			<div>
				<p className="text-lg">Supporting Document</p>
				<span className="mb-2 text-sm italic text-gray-500">
					You may optionally upload a PDF document. Additional supporting document can be included alongside the lab
					description. To upload a new document, please delete the existing attachment.
				</span>
				<div className="mt-2 flex gap-2">
					<DownloadButton lab={lab} variant="secondary-outline">
						<FaDownload /> Download
					</DownloadButton>
					<Button variant="danger-text" onClick={handleDeleteSupportingDocument}>
						<FaTimes /> Delete
					</Button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col ">
				<label htmlFor="labName" className="flex flex-col text-lg">
					Supporting Documents
					<span className="mb-2 text-sm italic text-gray-500">
						You may optionally upload a PDF document. Additional supporting documents can be included alongside the lab
						description.
					</span>
				</label>
				<input
					className="rounded-sm border border-slate-500 bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
					id="pdfAttachment"
					type="file"
					accept="application/pdf"
					onChange={(e) => handlePdfAttachmentChange(e)}
				/>
			</div>
		</>
	);
}

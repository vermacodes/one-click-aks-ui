import { useCallback } from "react";
import { ButtonVariant, Lab, LabType } from "../../../../dataStructures";
import { useSupportingDocument } from "../../../../hooks/useBlobs";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
	lab: Lab;
	labType?: LabType;
	variant?: ButtonVariant;
	successVariant?: ButtonVariant;
	children?: React.ReactNode;
};

export default function DownloadButton({ lab, variant = "secondary-text", children }: Props) {
	const { data: file } = useSupportingDocument(lab.supportingDocumentId);

	const downloadSupportingDocument = useCallback((lab: Lab) => {
		if (file) {
			const url = window.URL.createObjectURL(file);
			const link = window.document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${lab.name}.pdf`); // You can set the file name here
			window.document.body.appendChild(link);
			link.click();
			window.document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} else {
			alert("Failed to download supporting document");
		}
	}, []);

	return (
		<Button variant={variant} onClick={() => downloadSupportingDocument(lab)}>
			{children}
		</Button>
	);
}

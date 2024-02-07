import { toast } from "react-toastify";
import { ButtonVariant, Lab } from "../../../dataStructures";
import { useCreateLab } from "../../../hooks/useBlobs";
import Button from "../../UserInterfaceComponents/Button";

type Props = {
	lab: Lab;
	variant?: ButtonVariant;
	children?: React.ReactNode;
};

export default function PublishLabButton({ lab, variant = "secondary-text", children }: Props) {
	const { mutateAsync: createLab } = useCreateLab();

	function handlePublish() {
		toast.promise(createLab({ ...lab, isPublished: !lab.isPublished }), {
			pending: "Publishing...",
			success: "Lab published",
			error: "Error publishing lab",
		});
	}

	return (
		<Button variant={variant} onClick={handlePublish}>
			{children}
		</Button>
	);
}

import { useState } from "react";
import { toast } from "react-toastify";
import { ButtonVariant } from "../../../../dataStructures";
import { axiosInstance } from "../../../../utils/axios-interceptors";
import Button from "../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
	variant?: ButtonVariant;
	children: React.ReactNode;
	tooltipMessage?: string;
	tooltipDelay?: number;
	tooltipDirection?: "top" | "bottom" | "left" | "right";
};

export default function ResetActionStatus({
	variant = "danger-outline",
	children,
	tooltipMessage,
	tooltipDelay,
	tooltipDirection,
}: Props) {
	const [showModal, setShowModal] = useState<boolean>(false);

	function onClickHandler() {
		setShowModal(false);
		const response = toast.promise(axiosInstance.put("actionstatus", { inProgress: false }), {
			pending: "Resetting action status...",
			success: {
				render(data: any) {
					return `Action status reset completed.`;
				},
				autoClose: 2000,
			},
			error: {
				render(data: any) {
					return `Action status reset failed: ${data.data.response.data.error}`;
				},
				autoClose: 5000,
			},
		});
		response.then(() => {
			axiosInstance.put("logs/endstream");
		});
	}
	return (
		<>
			<Button
				variant={variant}
				onClick={() => setShowModal(true)}
				tooltipMessage={tooltipMessage}
				tooltipDelay={tooltipDelay}
				tooltipDirection={tooltipDirection}
				aria-label="Stop Runaway Action Modal Button"
			>
				{children}
			</Button>
			{showModal && (
				<ConfirmationModal
					title="Confirm Stop Runaway Action"
					onClose={() => setShowModal(false)}
					onConfirm={onClickHandler}
					closeLabel="Close Stop Runaway Action Modal"
					confirmLabel="Confirm Stop Runaway Action"
					cancelLabel="Cancel Stop Runaway Action"
				>
					<p className="text-lg">Are you sure you want to stop the running action?</p>
					<p className="text-xs">
						Reset the action status if you think server is gone crazy. This can breaks the safety net which prevents
						running duplicate actions on server. This also stops the log stream.
					</p>
				</ConfirmationModal>
			)}
		</>
	);
}

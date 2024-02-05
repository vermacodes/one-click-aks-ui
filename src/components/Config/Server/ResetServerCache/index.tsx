import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ButtonVariant } from "../../../../dataStructures";
import { useResetServerCache } from "../../../../hooks/useServerCache";
import { WebSocketContext } from "../../../Context/WebSocketContext";
import Button from "../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
	variant?: ButtonVariant;
	children: React.ReactNode;
	tooltipMessage?: string;
	tooltipDelay?: number;
	tooltipDirection?: "top" | "bottom" | "left" | "right";
};

export default function ResetServerCache({
	variant = "danger-outline",
	children,
	tooltipMessage,
	tooltipDelay,
	tooltipDirection,
}: Props) {
	const [showModal, setShowModal] = useState<boolean>(false);

	const { mutateAsync: resetServerCacheAsync } = useResetServerCache();
	const { actionStatus } = useContext(WebSocketContext);

	function handleResetServerCache() {
		const response = toast.promise(resetServerCacheAsync(), {
			pending: "Resetting Server Cache...",
			success: "Server Cache Reset.",
			error: {
				render(data: any) {
					return `Failed to reset server cache. ${data.data.response.data.error}`;
				},
			},
		});

		response.finally(() => {
			sessionStorage.clear(); // clear all session storage
			window.location.reload();
		});
	}

	return (
		<>
			<Button
				variant={variant}
				disabled={actionStatus.inProgress}
				onClick={() => setShowModal(true)}
				tooltipMessage={tooltipMessage}
				tooltipDelay={tooltipDelay}
				tooltipDirection={tooltipDirection}
			>
				{children}
			</Button>
			{showModal && (
				<ConfirmationModal
					title="Confirm Reset Server Cache"
					onClose={() => setShowModal(false)}
					onConfirm={handleResetServerCache}
				>
					<p className="text-lg">Are you sure you want to reset cache?</p>
					<p className="text-xs">
						This can help recover from many silly bugs due to bad data in server cache. Make sure to save your lab
						before you reset cache. It also reloads the page.
					</p>
				</ConfirmationModal>
			)}
		</>
	);
}

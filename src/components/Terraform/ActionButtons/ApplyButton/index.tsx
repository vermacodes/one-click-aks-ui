import React from "react";
import { FaRocket } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import { ButtonVariant, Lab } from "../../../../dataStructures";
import { useSelectedDeployment } from "../../../../hooks/useSelectedDeployment";
import { useTerraformOperation } from "../../../../hooks/useTerraformOperation";
import { useWebSocketContext } from "../../../Context/WebSocketContext";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
	variant: ButtonVariant;
	children: React.ReactNode;
	lab: Lab | undefined;
};

export default function ApplyButton({ variant, children, lab }: Props) {
	const { actionStatus } = useWebSocketContext();
	const { onClickHandler } = useTerraformOperation();
	const { selectedDeployment } = useSelectedDeployment();

	const queryClient = useQueryClient();

	return (
		<>
			<Button
				variant={variant}
				onClick={() => {
					const response = onClickHandler({
						operationType: "apply",
						lab: lab,
						deployment: selectedDeployment,
						operationId: uuid(),
					});

					if (response && lab?.type === "assignment") {
						response.then(() => {
							queryClient.invalidateQueries("get-assignments");
							queryClient.invalidateQueries("get-userassignedlabs");
							queryClient.invalidateQueries("get-my-assignments");
						});
					}
				}}
				disabled={actionStatus.inProgress || lab === undefined}
			>
				<span className="text-base">
					<FaRocket />
				</span>
				{children}
			</Button>
		</>
	);
}

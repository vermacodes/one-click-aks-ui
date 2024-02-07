import React, { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import { ButtonVariant, Lab } from "../../../../dataStructures";
import { useSelectedDeployment } from "../../../../hooks/useSelectedDeployment";
import { useTerraformOperation } from "../../../../hooks/useTerraformOperation";
import { WebSocketContext } from "../../../Context/WebSocketContext";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
	variant: ButtonVariant;
	children: React.ReactNode;
	lab: Lab | undefined;
	mode: "extend-apply" | "extend-validate" | "extend-destroy";
};

export default function ExtendButton({ variant, children, lab, mode }: Props) {
	const [validationInProgress, setValidationInProgress] = useState<boolean>(false);

	const { actionStatus } = useContext(WebSocketContext);
	const { selectedDeployment } = useSelectedDeployment();
	const { onClickHandler } = useTerraformOperation();

	const queryClient = useQueryClient();

	/**
	 * This useEffect hook is triggered whenever the `actionStatus` state changes.
	 *
	 * If `validationInProgress` is true and `actionStatus.inProgress` is false,
	 * it sets `validationInProgress` to false and invalidates the queries for
	 * "get-challenges-by-lab-id" and the current lab's id.
	 *
	 * This is done to ensure that the data for the challenges of the current lab
	 * is re-fetched and up-to-date after a validation action has completed.
	 */
	useEffect(() => {
		if (validationInProgress && actionStatus.inProgress === false) {
			setValidationInProgress(false);
			queryClient.invalidateQueries(["get-challenges-by-lab-id", lab?.id]);
		}
	}, [actionStatus]);

	return (
		<Button
			variant={variant}
			onClick={() => {
				setValidationInProgress(true);

				const response = onClickHandler({
					operationType: mode,
					lab: lab,
					deployment: selectedDeployment,
					operationId: uuid(),
				});

				if (response && lab) {
					response.then(() => {
						queryClient.invalidateQueries("get-assignments");
						queryClient.invalidateQueries("get-userassignedlabs");
						queryClient.invalidateQueries("get-my-assignments");
					});
				}
			}}
			disabled={actionStatus.inProgress || lab === undefined}
		>
			{children}
		</Button>
	);
}

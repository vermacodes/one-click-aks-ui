import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { DeploymentType, Lab, TerraformOperation, TerraformOperationType } from "../dataStructures";
import { useDeleteDeployment } from "./useDeployments";
import { useSetLogs } from "./useLogs";
import { usePreference } from "./usePreference";
import { useServerStatus } from "./useServerStatus";
import { useApply, useDestroy, useExtend, useInit, usePlan } from "./useTerraform";
import { useTerraformWorkspace } from "./useWorkspace";

export function useTerraformOperation() {
	const { data: serverStatus } = useServerStatus();
	const { mutate: setLogs } = useSetLogs();
	const { mutateAsync: initAsync } = useInit();
	const { mutateAsync: planAsync } = usePlan();
	const { mutateAsync: applyAsync } = useApply();
	const { mutateAsync: destroyAsync } = useDestroy();
	const { mutateAsync: extendAsync } = useExtend();
	const { data: preference } = usePreference();
	const { data: terraformWorkspaces } = useTerraformWorkspace();
	const { mutateAsync: deleteDeploymentAsync } = useDeleteDeployment();

	type DeleteDeploymentProps = {
		operationId: string;
		deployment: DeploymentType | undefined;
	};

	async function deleteDeployment({ operationId, deployment }: DeleteDeploymentProps) {
		if (deployment === undefined) {
			toast.error("No deployment selected.");
			return Promise.reject();
		}

		return deleteDeploymentAsync([deployment.deploymentWorkspace, deployment.deploymentSubscriptionId, operationId]);
	}

	type SubmitOperationProps = {
		operationType: TerraformOperationType;
		operationId: string;
		lab: Lab;
		deployment: DeploymentType;
		deleteDeployment?: boolean | undefined;
	};

	function submitOperation({
		operationType,
		operationId,
		lab,
		deployment,
		deleteDeployment: deleteDeploymentFlag = false,
	}: SubmitOperationProps): Promise<AxiosResponse<TerraformOperation>> {
		// update deployment with current lab.
		deployment.deploymentLab = lab;

		if (operationType === "plan") {
			return planAsync([deployment, operationId]);
		}
		if (operationType === "apply") {
			return applyAsync([deployment, operationId]);
		}
		if (operationType === "destroy" && deleteDeploymentFlag) {
			return deleteDeployment({ operationId, deployment });
		}
		if (operationType === "destroy" && !deleteDeploymentFlag) {
			return destroyAsync([deployment, operationId]);
		}
		if (operationType === "extend-validate") {
			return extendAsync([deployment, "validate", operationId]);
		}
		if (operationType === "extend-apply") {
			return extendAsync([deployment, "apply", operationId]);
		}
		if (operationType === "extend-destroy") {
			return extendAsync([deployment, "destroy", operationId]);
		}

		return initAsync([deployment, operationId]);
	}

	type OnClickHandlerProps = {
		operationType: TerraformOperationType;
		operationId: string;
		lab: Lab | undefined;
		deployment?: DeploymentType | undefined;
		deleteDeployment?: boolean | undefined;
	};

	const onClickHandler = ({
		operationType,
		operationId,
		lab,
		deployment,
		deleteDeployment = false,
	}: OnClickHandlerProps) => {
		if (lab === undefined || lab.template === undefined) {
			toast.error("This is strange! No lab is defined. Try 'Reset Server Cache' from settings page.", {
				autoClose: 10000,
			});
			return;
		}

		if (serverStatus === undefined || serverStatus.status !== "OK") {
			toast.error("Server not connected.");
			return;
		}

		if (terraformWorkspaces === undefined) {
			toast.warn("Waiting for terraform to be ready. Try again in a bit.", {
				autoClose: 10000,
			});
			return;
		}

		if (preference !== undefined) {
			lab.template.resourceGroup.location = preference.azureRegion;
		}

		setLogs({ logs: "" });

		if (deployment === undefined) {
			toast.error(
				"No deployment selected. Select a deployment from Deployments page or 'Reset Server Cache' from settings page.",
				{
					autoClose: 10000,
				}
			);
			return;
		}

		return submitOperation({
			operationType,
			operationId,
			lab,
			deployment,
			deleteDeployment,
		});
	};

	return { onClickHandler, deleteDeployment };
}

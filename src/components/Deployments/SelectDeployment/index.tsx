import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { WebSocketContext } from "../../../context/WebSocketContext";
import { ButtonVariant, DeploymentType } from "../../../dataStructures";
import { useSelectDeployment } from "../../../hooks/useDeployments";
import { useGetSelectedTerraformWorkspace } from "../../../hooks/useGetSelectedTerraformWorkspace";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { useTerraformWorkspace } from "../../../hooks/useWorkspace";
import Button from "../../UserInterfaceComponents/Button";
import PleaseWaitModal from "../../UserInterfaceComponents/Modal/PleaseWaitModal";

type SelectDeploymentProps = {
  variant: ButtonVariant;
  deployment: DeploymentType;
};

// Configuration constants
const DEPLOYMENT_CONFIG = {
  TIMEOUT_DURATION: 60000, // 60 seconds
  SUCCESS_DISPLAY_DURATION: 2000, // 2 seconds
  ERROR_DISPLAY_DURATION: 5000, // 5 seconds
} as const;

// State machine for deployment selection
type DeploymentState =
  | { type: "idle" }
  | { type: "selecting" }
  | { type: "waiting" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function SelectDeployment({
  variant,
  deployment,
}: SelectDeploymentProps) {
  const [state, setState] = useState<DeploymentState>({ type: "idle" });
  const [showModal, setShowModal] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  const { actionStatus } = useContext(WebSocketContext);
  const { data: workspaces } = useTerraformWorkspace();
  const { mutateAsync: asyncSelectDeployment } = useSelectDeployment();
  const { selectedTerraformWorkspace } = useGetSelectedTerraformWorkspace();
  const { selectedDeployment } = useSelectedDeployment();
  const queryClient = useQueryClient();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isProcessingRef.current = false;
  }, []);

  // Auto-close modal after delays
  const scheduleModalClose = useCallback(
    (delay: number) => {
      timeoutRef.current = setTimeout(() => {
        setShowModal(false);
        setState({ type: "idle" });
        cleanup();
      }, delay);
    },
    [cleanup],
  );

  // Handle deployment selection
  const handleSelectDeployment = useCallback(async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setState({ type: "selecting" });
    setShowModal(true);

    // Set timeout for failure case
    timeoutRef.current = setTimeout(() => {
      if (isProcessingRef.current && state.type !== "success") {
        setState({
          type: "error",
          message: "Operation timed out. Please try again.",
        });
        scheduleModalClose(DEPLOYMENT_CONFIG.ERROR_DISPLAY_DURATION);
      }
    }, DEPLOYMENT_CONFIG.TIMEOUT_DURATION);

    try {
      await asyncSelectDeployment(deployment);

      if (isProcessingRef.current) {
        setState({ type: "waiting" });
        queryClient.invalidateQueries(["list-deployments"]);
      }
    } catch (error) {
      cleanup();
      const errorMessage =
        error instanceof Error
          ? `Failed: ${error.message}`
          : "Failed to select deployment. Please try again.";
      setState({ type: "error", message: errorMessage });
      scheduleModalClose(DEPLOYMENT_CONFIG.ERROR_DISPLAY_DURATION);
    }
  }, [
    deployment,
    asyncSelectDeployment,
    queryClient,
    scheduleModalClose,
    cleanup,
    state.type,
  ]);

  // Monitor for successful selection
  useEffect(() => {
    if (
      isProcessingRef.current &&
      state.type === "waiting" &&
      selectedDeployment?.deploymentWorkspace === deployment.deploymentWorkspace
    ) {
      cleanup();
      setState({ type: "success" });
      scheduleModalClose(DEPLOYMENT_CONFIG.SUCCESS_DISPLAY_DURATION);
    }
  }, [
    selectedDeployment,
    deployment.deploymentWorkspace,
    state.type,
    cleanup,
    scheduleModalClose,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Generate modal message based on state
  const getModalMessage = () => {
    switch (state.type) {
      case "selecting":
        return "⌛ Selecting deployment, please wait...";
      case "waiting":
        return "⌛ Almost done, please wait...";
      case "success":
        return "✅ Deployment selected successfully!";
      case "error":
        return `❌ ${state.message}`;
      default:
        return "";
    }
  };

  // Early return for loading state
  if (workspaces === undefined) {
    return (
      <Button variant={variant} disabled={true}>
        <FaSpinner className="animate-spin" /> Loading...
      </Button>
    );
  }

  const isSelected =
    deployment.deploymentWorkspace === selectedTerraformWorkspace?.name;
  const isDisabled =
    isSelected ||
    actionStatus === undefined ||
    actionStatus.inProgress === true ||
    isProcessingRef.current;

  return (
    <>
      <Button
        variant={variant}
        disabled={isDisabled}
        onClick={handleSelectDeployment}
        aria-label={`Select ${deployment.deploymentWorkspace} deployment`}
      >
        {state.type === "selecting" || state.type === "waiting" ? (
          <>
            <FaSpinner className="animate-spin" /> Selecting...
          </>
        ) : isSelected ? (
          <>
            <FaCheck /> Selected
          </>
        ) : (
          <>
            <FaCheck /> Select
          </>
        )}
      </Button>
      {showModal && <PleaseWaitModal modalMessage={getModalMessage()} />}
    </>
  );
}

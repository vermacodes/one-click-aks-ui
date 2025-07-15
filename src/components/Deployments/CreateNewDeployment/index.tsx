import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "react-query";
import { ButtonVariant } from "../../../dataStructures";
import { getUIStateColors } from "../../../defaults";
import { useDefaultAccount } from "../../../hooks/useDefaultAccount";
import { useAddDeployment } from "../../../hooks/useDeployments";
import { useLab } from "../../../hooks/useLab";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { cn } from "../../../utils/cn";
import { deploymentNameSchema } from "../../../zodSchemas";
import { WebSocketContext } from "../../Context/WebSocketContext";
import Button from "../../UserInterfaceComponents/Button";
import Input from "../../UserInterfaceComponents/Input";
import ModalBackdrop from "../../UserInterfaceComponents/Modal/ModalBackdrop";
import PleaseWaitModal from "../../UserInterfaceComponents/Modal/PleaseWaitModal";

type Props = {
  variant: ButtonVariant;
  tooltipMessage?: string;
  tooltipDelay?: number;
  children: React.ReactNode;
};

export default function CreateNewDeployment({
  variant,
  tooltipMessage,
  tooltipDelay,
  children,
}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newWorkSpaceName, setNewWorkSpaceName] = useState<string>("");
  const [isNewWorkspaceNameModified, setIsNewWorkspaceNameModified] =
    useState<boolean>(false);
  const { actionStatus } = useContext(WebSocketContext);
  const [showPleaseWaitModal, setShowPleaseWaitModal] =
    useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const { mutateAsync: addDeployment } = useAddDeployment();
  const { data: lab } = useLab();
  const queryClient = useQueryClient();
  const { selectedDeployment } = useSelectedDeployment();
  const { defaultAccount } = useDefaultAccount();

  useEffect(() => {
    if (selectedDeployment?.deploymentWorkspace === newWorkSpaceName) {
      setModalMessage("✅ All done.");
      setTimeout(() => {
        setShowPleaseWaitModal(false);
        setNewWorkSpaceName("");
      }, 2000);
    }
  }, [selectedDeployment]);

  // Close the modal and reset the state
  const handleModalClose = () => {
    setIsNewWorkspaceNameModified(false);
    setShowModal(false);
  };

  function handleAddWorkspace() {
    if (lab === undefined) {
      console.error("Lab is undefined");
      handleModalClose();
      return;
    }

    if (defaultAccount === undefined) {
      console.error("Default subscription is undefined");
      handleModalClose();
      return;
    }

    setModalMessage("⌛ Adding deployment, Please wait...");
    setShowPleaseWaitModal(true);
    handleModalClose();

    addDeployment({
      deploymentId: "",
      deploymentUserId: "",
      deploymentWorkspace: newWorkSpaceName,
      deploymentSubscriptionId: defaultAccount.id,
      deploymentAutoDelete: true,
      deploymentAutoDeleteUnixTime: 0,
      deploymentLifespan: 28800,
      deploymentStatus: "Deployment Not Started",
      deploymentLab: lab,
    })
      .then(() => {
        setModalMessage("⌛ Almost done. Please wait...");
        queryClient.invalidateQueries(["list-deployments"]);

        setTimeout(() => {
          setModalMessage("❌ Failed to add deployment.");
          setTimeout(() => {
            setShowPleaseWaitModal(false);
            setNewWorkSpaceName("");
          }, 5000);
        }, 60000);
      })
      .catch(() => {
        setModalMessage("❌ Failed to add deployment.");
        setTimeout(() => {
          setShowPleaseWaitModal(false);
          setNewWorkSpaceName("");
        }, 5000);
      });
  }

  return (
    <>
      <Button
        variant={variant}
        tooltipMessage={tooltipMessage}
        tooltipDelay={tooltipDelay}
        onClick={() => setShowModal(true)}
        disabled={actionStatus.inProgress}
      >
        {children}
      </Button>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          newWorkSpaceName={newWorkSpaceName}
          setNewWorkSpaceName={setNewWorkSpaceName}
          handleAddWorkspace={handleAddWorkspace}
          isNewWorkspaceNameModified={isNewWorkspaceNameModified}
          setIsNewWorkspaceNameModified={setIsNewWorkspaceNameModified}
          handleModalClose={handleModalClose}
        />
      )}
      {showPleaseWaitModal && <PleaseWaitModal modalMessage={modalMessage} />}
    </>
  );
}

type ModalProps = {
  setShowModal(args: boolean): void;
  newWorkSpaceName: string;
  setNewWorkSpaceName(args: string): void;
  handleAddWorkspace(): void;
  isNewWorkspaceNameModified: boolean;
  setIsNewWorkspaceNameModified(args: boolean): void;
  handleModalClose(): void;
};

function Modal({
  newWorkSpaceName,
  setNewWorkSpaceName,
  handleAddWorkspace,
  isNewWorkspaceNameModified,
  setIsNewWorkspaceNameModified,
  handleModalClose,
}: ModalProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { actionStatus } = useContext(WebSocketContext);

  function handleWorkspaceNameTextField(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;
    setNewWorkSpaceName(value);
    setIsNewWorkspaceNameModified(true);

    const result = deploymentNameSchema.safeParse(value);

    if (result.success) {
      setErrorMessage("");
    } else {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(" ");
      setErrorMessage(errorMessages);
    }
  }

  return (
    <ModalBackdrop
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        handleModalClose();
        e.stopPropagation();
      }}
    >
      <div
        className={cn(
          "scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600",
          "my-20 h-[35%] max-h-80 w-1/3 space-y-2 divide-y divide-slate-300 overflow-x-hidden",
          "overflow-y-auto rounded-sm p-5 dark:divide-slate-700",
          getUIStateColors(),
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex w-full justify-between pb-2">
          <h1 className="text-3xl">New Deployment</h1>
          <Button
            variant="secondary-icon"
            onClick={() => handleModalClose()}
            aria-label="Close Modal"
          >
            <MdClose className="text-3xl" />
          </Button>
        </div>
        <div className="flex w-full flex-col gap-y-2 pt-4">
          <div className="flex w-full justify-between gap-x-2">
            <Input
              type="text"
              aria-label="New Deployment Name"
              tooltipMessage="Name your new deployment."
              tooltipDirection="bottom"
              tooltipDelay={500}
              className={cn(
                "block h-9 w-full px-2", // Ensure w-full is applied
                isNewWorkspaceNameModified &&
                  errorMessage &&
                  "border-0 ring-1 ring-rose-500 outline-0 dark:ring-rose-500", // Conditional class
              )}
              fullWidth={true}
              placeholder="Name your new deployment."
              value={newWorkSpaceName}
              onChange={handleWorkspaceNameTextField}
            />
            <div className="flex items-center gap-x-2">
              <Button
                variant="primary"
                onClick={() => handleAddWorkspace()}
                disabled={
                  !deploymentNameSchema.safeParse(newWorkSpaceName).success ||
                  actionStatus.inProgress
                }
              >
                Create
              </Button>
              <Button variant="secondary" onClick={() => handleModalClose()}>
                Cancel
              </Button>
            </div>
          </div>
          {isNewWorkspaceNameModified && errorMessage && (
            <div
              className={cn(
                "rounded-sm p-2",
                getUIStateColors({ colors: "danger" }),
              )}
            >
              <p className="error-message">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

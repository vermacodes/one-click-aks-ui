import React from "react";
import { FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { ButtonVariant, DeploymentType, Lab } from "../../../../dataStructures";
import { useSelectedDeployment } from "../../../../hooks/useSelectedDeployment";
import { useTerraformOperation } from "../../../../hooks/useTerraformOperation";
import { useWebSocketContext } from "../../../Context/WebSocketContext";
import Button from "../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  variant: ButtonVariant;
  navbarButton?: boolean;
  deployment?: DeploymentType | undefined;
  deleteWorkspace?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  lab: Lab | undefined;
};

export default function DestroyButton({
  variant,
  deployment,
  deleteWorkspace,
  disabled,
  children,
  lab,
}: Props) {
  const { actionStatus } = useWebSocketContext();
  const { selectedDeployment } = useSelectedDeployment();
  const { onClickHandler: onConfirmDelete } = useTerraformOperation();

  const [showModal, setShowModal] = React.useState(false);

  function onClickHandler() {
    setShowModal(true);
  }

  return (
    <>
      <Button
        variant={variant}
        onClick={onClickHandler}
        disabled={actionStatus.inProgress || lab === undefined || disabled}
      >
        <span className="text-base">
          <FaTrash />
        </span>
        {children}
      </Button>
      {showModal && (
        <ConfirmationModal
          title={"Confirm Destroy" + (deleteWorkspace ? " and Delete" : "")}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            onConfirmDelete({
              operationType: "destroy",
              operationId: uuid(),
              lab: lab,
              deployment: deployment || selectedDeployment,
              deleteDeployment: deleteWorkspace || false,
            });
          }}
          closeLabel="Close Terraform Destroy Modal"
          confirmLabel="Confirm terraform destroy"
          cancelLabel="Cancel terraform destroy"
        >
          <p className="text-2xl">
            Are you sure you want to destroy resources
            {deleteWorkspace ? " and delete " : " of "} this deployment? This is
            not reversible.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
}

import { useState } from "react";
import { FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ButtonVariant } from "../../../dataStructures";
import { useDeleteLab, useLab } from "../../../hooks/useLab";
import { useSetLogs } from "../../../hooks/useLogs";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import Button from "../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  buttonVariant?: ButtonVariant;
  children?: React.ReactNode;
  newLab?: boolean;
};

export default function ResetLabState({ buttonVariant, children, newLab = false }: Props) {
  const [showModal, setShowModal] = useState(false);

  const { mutate: setLogs } = useSetLogs();
  const { mutateAsync: deleteLab } = useDeleteLab();
  const { refetch } = useLab();
  const { setSyncLab } = useGlobalStateContext();

  const navigate = useNavigate();

  function onClickHandler() {
    setShowModal(true);
  }

  async function handleResetLabState() {
    setShowModal(false);
    setLogs({
      logs: "",
    });

    const labResetPromise = async () => {
      // Await the deleteLab function
      await deleteLab();

      // Set syncLab to true
      setSyncLab(true);

      // Refetch data
      await refetch();
    };

    const response = toast.promise(
      labResetPromise(),
      {
        pending: "Resetting lab...",
        success: "Lab reset completed.",
        error: "Lab reset failed.",
      },
      {
        toastId: "reset-lab",
      }
    );

    response.then(() => {
      navigate("/builder");
    });
  }

  return (
    <>
      <Button variant={buttonVariant ? buttonVariant : "secondary-text"} onClick={() => onClickHandler()}>
        {children ? (
          children
        ) : (
          <>
            <FaRedo /> Reset
          </>
        )}
      </Button>
      {showModal && (
        <ConfirmationModal
          onClose={() => setShowModal(false)}
          onConfirm={handleResetLabState}
          title={newLab ? "Confirm Adding New Lab" : "Confirm Lab Reset"}
        >
          <p className="text-xl">
            <strong>Are you sure?</strong> This will irreversibly reset all changes you made to lab in memory including
            the extension script.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
}

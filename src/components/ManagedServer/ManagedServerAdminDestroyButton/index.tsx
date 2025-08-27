import { isAxiosError } from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer } from "../../../dataStructures";
import { useAdminDestroyManagedServer } from "../../../hooks/useManagedServer";
import Button from "../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  managedServer: ManagedServer;
};

export default function ManagedServerAdminDestroyButton({
  managedServer,
}: Props) {
  const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);
  const { mutateAsync: destroyManagedServer } = useAdminDestroyManagedServer();

  const handleDestroy = (userPrincipalName: string) => {
    const response = toast.promise(destroyManagedServer(userPrincipalName), {
      pending: "Destroying managed server...",
      success: {
        render() {
          return `Managed server Destroyed.`;
        },
        autoClose: 2000,
      },
      error: {
        render({ data }) {
          if (isAxiosError(data)) {
            return `Failed to destroy managed server. ${data?.response?.data?.error}`;
          }
          return `Failed to destroy managed server.`;
        },
        autoClose: 5000,
      },
    });

    response.finally(() => {});
  };

  return (
    <>
      <Button
        variant="danger-text"
        onClick={() => setConfirmDestroy(true)}
        aria-label="Destroy Managed Server"
      >
        <FaTrash /> Destroy
      </Button>
      {confirmDestroy && (
        <ConfirmationModal
          title="Confirm Destroy Server"
          onConfirm={() => {
            setConfirmDestroy(false);
            handleDestroy(managedServer.userPrincipalName);
          }}
          onClose={() => setConfirmDestroy(false)}
          closeLabel="Close Destroy Managed Server Modal"
          confirmLabel="Destroy Managed Server"
          cancelLabel="Cancel Destroy Managed Server"
        >
          <p className="text-xl">
            Are you sure you want to destroy the managed server?
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li className="text-sm">
              <span className="font-bold underline">IMPORTANT</span> 👉 You are
              about to destroy managed server for another user. This might cause
              issues if the server is running and they are actively using it.
              Only use this feature to resolve issues, not to create.
            </li>
          </ul>
        </ConfirmationModal>
      )}
    </>
  );
}

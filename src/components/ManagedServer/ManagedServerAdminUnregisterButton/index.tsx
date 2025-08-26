import { isAxiosError } from "axios";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer } from "../../../dataStructures";
import { useAdminUnregister } from "../../../hooks/useManagedServer";
import Button from "../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  managedServer: ManagedServer;
};

export default function ManagedServerAdminUnregisterButton({
  managedServer,
}: Props) {
  const [confirmUnregister, setConfirmUnregister] = useState<boolean>(false);
  const { mutateAsync: adminUnregister } = useAdminUnregister();

  const handleUnregister = (userPrincipalName: string) => {
    const response = toast.promise(adminUnregister(userPrincipalName), {
      pending: "Unregistering managed server...",
      success: {
        render() {
          return `Managed server Unregistered.`;
        },
        autoClose: 2000,
      },
      error: {
        render({ data }) {
          if (isAxiosError(data)) {
            return `Failed to unregister managed server. ${data?.response?.data?.error}`;
          }
          return `Failed to unregister managed server.`;
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
        onClick={() => setConfirmUnregister(true)}
        aria-label="Unregister Managed Server"
      >
        <FaTimes /> Unregister
      </Button>
      {confirmUnregister && (
        <ConfirmationModal
          title="Confirm Unregister Server"
          onConfirm={() => {
            setConfirmUnregister(false);
            handleUnregister(managedServer.userPrincipalName);
          }}
          onClose={() => setConfirmUnregister(false)}
          closeLabel="Close Unregister Managed Server Modal"
          confirmLabel="Unregister Managed Server"
          cancelLabel="Cancel Unregister Managed Server"
        >
          <p className="text-xl">
            Are you sure you want to unregister the managed server for{" "}
            <span className="font-bold italic underline">
              {managedServer.userPrincipalName}
            </span>
            ?
          </p>
          <p className="flex items-center justify-center gap-2 text-2xl font-bold text-rose-700 underline dark:text-rose-400">
            STOP AND READ
          </p>
          <p>
            You are about to unregister managed server for another user. This
            might cause issues if the server is running and they are actively
            using it. Also, the user will need to manually register the server
            again. Please proceed with caution.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
}

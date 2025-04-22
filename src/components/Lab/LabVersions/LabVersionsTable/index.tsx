import { useEffect, useState } from "react";
import { FaCheck, FaStar } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Lab } from "../../../../dataStructures";
import { getUIStateColors } from "../../../../defaults";
import { useCreateLab } from "../../../../hooks/useBlobs";
import { cn } from "../../../../utils/cn";
import Button from "../../../UserInterfaceComponents/Button";
import Checkbox from "../../../UserInterfaceComponents/Checkbox";
import Container from "../../../UserInterfaceComponents/Container";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";

type Props = {
  parentLab: Lab;
  labs: Lab[];
  selectedLab: Lab;
  setSelectedLab: (lab: Lab) => void;
  versionA: Lab;
  versionB: Lab;
  setVersionA: (lab: Lab) => void;
  setVersionB: (lab: Lab) => void;
};

export default function LabVersionsTable({
  parentLab,
  labs,
  selectedLab,
  setSelectedLab,
  versionA,
  versionB,
  setVersionA,
  setVersionB,
}: Props) {
  const [classification, setClassification] = useState<string>("public");
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const { mutateAsync: createLab } = useCreateLab();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (parentLab) {
      if (parentLab.type === "publiclab") {
        setClassification("public");
      } else {
        setClassification("protected");
      }
    }
  }, [parentLab]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  function handleCompareSelection(lab: Lab) {
    if (versionB.versionId === "") {
      setVersionA(lab);
      setVersionB(lab);
      return;
    }
    setVersionA(versionB);
    setVersionB(lab);
  }

  function onConfirmCreateLab(lab: Lab) {
    setShowConfirmationModal(false);
    const response = toast.promise(createLab(lab), {
      pending: "Saving lab...",
      success: "Lab saved.",
      error: {
        render(data: any) {
          return `Lab creation failed: ${data.data.response.data.error}`;
        },
        autoClose: false,
      },
    });

    response.then(() => {
      queryClient.invalidateQueries("labs");
      queryClient.invalidateQueries("sharedLabs");
      queryClient.invalidateQueries("publicLabs");
      queryClient.invalidateQueries(
        `versions-${parentLab.type}-${parentLab.id}-${classification}`,
      );
    });
  }

  return (
    <Container>
      <table className="h-full w-full max-w-full table-auto border-separate justify-between gap-y-6 rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">Compare</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Updated On</th>
            <th className="px-4 py-2">Updated By</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {labs
            ?.sort(
              (a, b) =>
                new Date(b.versionId).getTime() -
                new Date(a.versionId).getTime(),
            )
            .map((lab, index) => (
              <tr
                key={lab.versionId}
                className={cn(
                  getUIStateColors("hover"),
                  lab.isCurrentVersion && getUIStateColors("selected"),
                )}
                onClick={() => setSelectedLab(lab)}
              >
                <td className="px-4 py-2">
                  <Checkbox
                    label={
                      versionA.versionId === lab.versionId
                        ? "A"
                        : versionB.versionId === lab.versionId
                          ? "B"
                          : ""
                    }
                    id={lab.versionId}
                    handleOnChange={() => handleCompareSelection(lab)}
                    checked={
                      versionA.versionId === lab.versionId ||
                      versionB.versionId === lab.versionId
                    }
                  />
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{formatDate(lab.versionId)}</td>
                <td className="px-4 py-2">
                  {lab.updatedBy !== "" ? lab.updatedBy : lab.createdBy}
                </td>
                <td>
                  {!lab.isCurrentVersion &&
                  labs.length > 1 &&
                  lab.versionId !== "" ? (
                    <Button
                      variant="primary-text"
                      onClick={() => setShowConfirmationModal(true)}
                    >
                      <FaCheck /> Set Current
                    </Button>
                  ) : (
                    <p className="flex items-center gap-x-2 pl-2">
                      <FaStar />
                      Current Version
                    </p>
                  )}
                </td>
                {showConfirmationModal && (
                  <ConfirmationModal
                    title="Confirm Update"
                    onClose={() => setShowConfirmationModal(false)}
                    onConfirm={() => onConfirmCreateLab(lab)}
                  >
                    <p className="text-xl">
                      Are you sure? This will create a new version for all users
                      to see.
                    </p>
                  </ConfirmationModal>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { usePreference, useSetPreference } from "../../../hooks/usePreference";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";
import Input from "../../UserInterfaceComponents/Input";

export default function UserDefaultVMSize() {
  const [userDefaultVMSize, setUserDefaultVMSize] = useState<string>("");
  const { data: serverStatus } = useServerStatus();
  const [edit, setEdit] = useState<boolean>(false);

  const {
    data: preference,
    isLoading: loadingPreference,
    isFetching: fetchingPreference,
  } = usePreference();

  const { mutate: setPreference, isLoading: settingPreference } =
    useSetPreference();

  useEffect(() => {
    if (preference && preference.userDefaultVMSize) {
      setUserDefaultVMSize(preference.userDefaultVMSize);
    }
  }, [preference]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = userDefaultVMSize.trim();

    // Don't submit if the value is empty after trimming
    if (!trimmedValue || preference === undefined) {
      return;
    }

    setPreference(
      {
        ...preference,
        userDefaultVMSize: trimmedValue,
      },
      {
        onSuccess: () => {
          // Update the state with the trimmed value
          setUserDefaultVMSize(trimmedValue);
          setEdit(false);
        },
      },
    );
  }

  if (serverStatus?.status !== "OK") {
    return <></>;
  }

  const isLoading = loadingPreference || fetchingPreference;
  const canEdit = !isLoading && !settingPreference;

  return (
    <Container title="Default VM Size" collapsible={true}>
      <div className="flex w-full flex-col gap-4 py-2">
        {isLoading ? (
          <div className="flex h-fit w-full items-center justify-center rounded border border-slate-500 px-2 py-3 text-slate-600 dark:text-slate-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : (
          <div
            className={`${
              edit &&
              "ring-3 ring-sky-700 ring-offset-0 ring-offset-slate-50 dark:ring-sky-500"
            } flex h-fit w-full items-center justify-between rounded border border-slate-500 px-2 py-1 ${
              canEdit ? "cursor-pointer" : "cursor-not-allowed opacity-60"
            }`}
            onDoubleClick={() => {
              if (canEdit) setEdit(true);
            }}
          >
            <p
              className={`${edit && "hidden"} items-center px-1 break-all`}
              onClick={() => canEdit && setEdit(true)}
            >
              {userDefaultVMSize || "No default VM size set"}
            </p>
            <form
              id="vm-size-form"
              className={`${!edit && "hidden"} h-full w-full px-1`}
              onSubmit={(e) => handleSubmit(e)}
            >
              <Input
                className={`h-full w-full border-none outline-hidden`}
                value={userDefaultVMSize}
                onChange={(event) => setUserDefaultVMSize(event.target.value)}
                disabled={settingPreference}
                aria-label="Default VM Size"
                placeholder="e.g., Standard_D2s_v3"
              />
            </form>
            {edit && (
              <div className="flex gap-1">
                <Button
                  variant="primary-icon"
                  type="submit"
                  form="vm-size-form"
                  disabled={settingPreference || !userDefaultVMSize.trim()}
                  aria-label={settingPreference ? "Saving..." : "Save Edit"}
                  title={settingPreference ? "Saving..." : "Save changes"}
                >
                  {settingPreference ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <FaCheck />
                  )}
                </Button>
                <Button
                  variant="danger-icon"
                  onClick={() => {
                    setEdit(false);
                    if (preference && preference.userDefaultVMSize) {
                      setUserDefaultVMSize(preference.userDefaultVMSize);
                    }
                  }}
                  disabled={settingPreference}
                  aria-label="Cancel Edit"
                  title="Cancel changes"
                >
                  <FaTimes />
                </Button>
              </div>
            )}
            {!edit && (
              <Button
                variant="primary-icon"
                disabled={!canEdit}
                onClick={() => {
                  setEdit(true);
                }}
                aria-label="Edit"
                title="Edit default VM size"
              >
                <FaEdit />
              </Button>
            )}
          </div>
        )}
        <Footnote>
          <p>
            Select the default VM size to be used when creating new labs. This
            setting can be overridden during lab creation. Please select the VM
            Size available in your Azure region.
          </p>
        </Footnote>
      </div>
    </Container>
  );
}

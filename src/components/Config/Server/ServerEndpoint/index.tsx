import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { ServerHosting } from "../../../../dataStructures";
import Button from "../../../UserInterfaceComponents/Button";
import Input from "../../../UserInterfaceComponents/Input";
import Tooltip from "../../../UserInterfaceComponents/Tooltip";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
  editable?: boolean;
};

export default function ServerEndpoint({
  serverHosting,
  setServerHosting,
  editable = false,
}: Props) {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    setBaseUrl(serverHosting.endpoint);
  }, [serverHosting]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEdit(false);
    handleSwitch(baseUrl);
  }

  function handleSwitch(baseUrl: string) {
    setServerHosting({ ...serverHosting, endpoint: baseUrl });
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-1">
      <p>Endpoint</p>
      <Tooltip
        message={editable ? "Double click to edit." : "edit not allowed"}
        delay={1000}
      >
        <div
          className={`${
            edit &&
            "ring-3 ring-sky-700 ring-offset-0 ring-offset-slate-50 dark:ring-sky-500"
          } ${`${
            editable ? "cursor-pointer" : "cursor-default"
          }`} flex h-fit w-full items-center justify-between rounded-sm border border-slate-500 px-2 py-1`}
          onDoubleClick={() => {
            editable && setEdit(true);
          }}
        >
          <p
            className={`${
              edit && "hidden"
            } items-center overflow-hidden px-1 break-words whitespace-pre-wrap`}
          >
            {baseUrl}
          </p>
          <form
            className={`${!edit && "hidden"} h-full w-full`}
            onSubmit={(e) => handleSubmit(e)}
          >
            <Input
              id="endpoint"
              className={`w-full items-center overflow-hidden px-1 break-words whitespace-pre-wrap outline-hidden`}
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
            />
          </form>
          {edit && (
            <div className="flex">
              <Button
                variant="primary-icon"
                onClick={() => {
                  setEdit(false);
                  handleSwitch(baseUrl);
                }}
                aria-label="Save Endpoint Edit"
              >
                <FaCheck />
              </Button>
              <Button
                variant="danger-icon"
                onClick={() => {
                  setEdit(false);
                }}
                aria-label="Cancel Endpoint Edit"
              >
                <FaTimes />
              </Button>
            </div>
          )}
          {!edit && (
            <Button
              variant="primary-icon"
              disabled={!editable}
              onClick={() => {
                setEdit(true);
              }}
              aria-label="Edit Endpoint"
            >
              <FaEdit />
            </Button>
          )}
        </div>
      </Tooltip>
    </div>
  );
}

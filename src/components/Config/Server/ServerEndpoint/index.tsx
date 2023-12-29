import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { ServerHosting } from "../../../../dataStructures";
import Button from "../../../UserInterfaceComponents/Button";
import Tooltip from "../../../UserInterfaceComponents/Tooltip";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
  editable?: boolean;
};

export default function ServerEndpoint({ serverHosting, setServerHosting, editable = false }: Props) {
  const [baseUrl, setBaseUrl] = useState<string>("http://localhost:8880/");
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    setBaseUrl(serverHosting.endpoint);
  }, []);

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
      <Tooltip message={editable ? "Double click to edit." : "edit not allowed"} delay={1000}>
        <div
          className={`${edit && "ring ring-sky-500 ring-offset-0 ring-offset-slate-50 "}
          ${`${
            editable ? "cursor-pointer " : "cursor-default "
          }`} flex h-fit w-full items-center justify-between rounded border border-slate-500 py-1 px-2`}
          onDoubleClick={() => {
            editable && setEdit(true);
          }}
        >
          <p
            className={`${
              edit && "hidden"
            } items-center overflow-hidden whitespace-pre-wrap break-words bg-inherit px-1`}
          >
            {baseUrl}
          </p>
          <form className={`${!edit && "hidden"} h-full w-full bg-inherit`} onSubmit={(e) => handleSubmit(e)}>
            <input
              id="endpoint"
              className={`w-full items-center overflow-hidden whitespace-pre-wrap break-words bg-inherit px-1 outline-none`}
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
            />
          </form>
          {edit && (
            <div className="flex">
              <Button
                variant="primary-icon"
                onClick={() => {
                  localStorage.setItem("baseUrl", baseUrl);
                  setEdit(false);
                  window.location.reload();
                }}
              >
                <FaCheck />
              </Button>
              <Button
                variant="danger-icon"
                onClick={() => {
                  setEdit(false);
                }}
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
            >
              <FaEdit />
            </Button>
          )}
        </div>
      </Tooltip>
    </div>
  );
}

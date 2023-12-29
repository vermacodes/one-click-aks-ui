import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";

type Props = {};

export default function ActlabsHubEndpoint({}: Props) {
  const [baseUrl, setBaseUrl] = useState<string>("https://actlabs-hub.eastus.azurecontainer.io");
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    const baseUrlFromLocalStorage = localStorage.getItem("actlabsHubBaseUrl");

    if (baseUrlFromLocalStorage != undefined && baseUrlFromLocalStorage == "https://actlabs-auth.azurewebsites.net") {
      localStorage.setItem("actlabsHubBaseUrl", baseUrl);
      return;
    }

    if (baseUrlFromLocalStorage != undefined && baseUrlFromLocalStorage !== "") {
      setBaseUrl(baseUrlFromLocalStorage);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("actlabsHubBaseUrl", baseUrl);
    setEdit(false);
    window.location.reload();
  }

  return (
    <Container title="Actlabs Hub Endpoint" collapsible={true}>
      <div className="flex w-full flex-col gap-4 py-2">
        <div
          className={`${edit && "ring ring-sky-500 ring-offset-0 ring-offset-slate-50 "}
          flex h-fit w-full cursor-pointer items-center justify-between rounded border border-slate-500 py-1 px-2`}
          onDoubleClick={() => {
            setEdit(true);
          }}
        >
          <p className={`${edit && "hidden"} items-center bg-inherit px-1`} onClick={() => setEdit(true)}>
            {baseUrl}
          </p>
          <form className={`${!edit && "hidden"} h-full w-full bg-inherit px-1`} onSubmit={(e) => handleSubmit(e)}>
            <input
              className={`h-full w-full bg-inherit outline-none`}
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
              disabled={false}
              onClick={() => {
                setEdit(true);
              }}
            >
              <FaEdit />
            </Button>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          <p className="text-xs">
            You probably don't want to edit this unless you know what you are doing. But, if you know, you know. Go
            ahead.
          </p>
        </div>
      </div>
    </Container>
  );
}

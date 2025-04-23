import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";
import Input from "../../UserInterfaceComponents/Input";

type Props = {};

export default function ActlabsHubEndpoint({}: Props) {
  const [baseUrl, setBaseUrl] = useState<string>(
    "https://actlabs-hub-capp.purplegrass-7409b036.eastus.azurecontainerapps.io",
  );
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    const baseUrlFromLocalStorage = localStorage.getItem("actlabsHubBaseUrl");

    if (
      baseUrlFromLocalStorage != undefined &&
      (baseUrlFromLocalStorage.includes(
        "https://actlabs-auth.azurewebsites.net",
      ) ||
        baseUrlFromLocalStorage.includes(
          "https://actlabs-hub.eastus.azurecontainer.io",
        ))
    ) {
      localStorage.setItem("actlabsHubBaseUrl", baseUrl);
      return;
    }

    if (
      baseUrlFromLocalStorage != undefined &&
      baseUrlFromLocalStorage !== ""
    ) {
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
          className={`${
            edit &&
            "ring-3 ring-sky-700 ring-offset-0 ring-offset-slate-50 dark:ring-sky-500"
          } flex h-fit w-full cursor-pointer items-center justify-between rounded border border-slate-500 px-2 py-1`}
          onDoubleClick={() => {
            setEdit(true);
          }}
        >
          <p
            className={`${edit && "hidden"} items-center px-1`}
            onClick={() => setEdit(true)}
          >
            {baseUrl}
          </p>
          <form
            className={`${!edit && "hidden"} h-full w-full px-1`}
            onSubmit={(e) => handleSubmit(e)}
          >
            <Input
              className={`h-full w-full border-none outline-hidden`}
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              aria-label="Actlabs Hub Base URL"
            />
          </form>
          {edit && (
            <div className="flex">
              <Button
                variant="primary-icon"
                onClick={() => {
                  localStorage.setItem("actlabsHubBaseUrl", baseUrl);
                  setEdit(false);
                  window.location.reload();
                }}
                aria-label="Save Edit"
              >
                <FaCheck />
              </Button>
              <Button
                variant="danger-icon"
                onClick={() => {
                  setEdit(false);
                }}
                aria-label="Cancel Edit"
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
              aria-label="Edit"
            >
              <FaEdit />
            </Button>
          )}
        </div>
        <Footnote>
          <p>
            You probably don't want to edit this unless you know what you are
            doing. But, if you know, you know. Go ahead.
          </p>
        </Footnote>
      </div>
    </Container>
  );
}

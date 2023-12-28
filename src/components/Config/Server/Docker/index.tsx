import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { ServerHosting } from "../../../../dataStructures";
import { useResetServerCache } from "../../../../hooks/useServerCache";
import Container from "../../../UserInterfaceComponents/Container";
import ServerEndpoint from "../ServerEndpoint";

type Props = {
  serverHosting: ServerHosting;
  setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function Docker({ serverHosting, setServerHosting }: Props) {
  const [baseUrl, setBaseUrl] = useState<string>("http://localhost:8880/");
  const [showEditButton, setShowEditButton] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const { mutateAsync: resetServerCache } = useResetServerCache();

  useEffect(() => {
    const baseUrlFromLocalStorage = localStorage.getItem("baseUrl");
    if (baseUrlFromLocalStorage != undefined && baseUrlFromLocalStorage !== "") {
      setBaseUrl(baseUrlFromLocalStorage);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEdit(false);
    handleSwitch(baseUrl);
  }

  function handleSwitch(baseUrl: string) {
    localStorage.setItem("baseUrl", baseUrl);
    setBaseUrl(baseUrl);
    window.location.reload();
    resetServerCache().finally(() => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries();
    });
  }

  return (
    <Container title="Docker" collapsible={true} hoverEffect={false} additionalClasses="border dark:border-slate-700 border-slate-300">
      <ServerEndpoint serverHosting={serverHosting} setServerHosting={setServerHosting} editable={true} />
    </Container>
  );
}

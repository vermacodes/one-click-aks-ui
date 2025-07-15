import { useEffect } from "react";
import ServerConfig from "../../components/Config/Server/ServerConfig";
import { defaultLinkTextStyle } from "../../defaults";
import PageLayout from "../../layouts/PageLayout";

export default function ServerError() {
  useEffect(() => {
    document.title = "ACT Labs | Where is the server?";
  }, []);

  return (
    <PageLayout heading="Where is the server?">
      <div className="flex flex-col gap-8 pb-12">
        <p className="text-xl text-slate-700 dark:text-slate-300">
          This part of ACT Labs require{" "}
          <span className="font-bold italic underline">your</span> server to be
          running.{" "}
          <a
            href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280601/Getting-Started"
            target={"_blank"}
            className={defaultLinkTextStyle}
          >
            Learn more &rarr;
          </a>
        </p>
        <ServerConfig />
      </div>
    </PageLayout>
  );
}

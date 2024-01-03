import { useEffect } from "react";
import PageLayout from "../../layouts/PageLayout";

export default function ServerError() {
  useEffect(() => {
    document.title = "ACT Labs | Server Error";
  }, []);

  return (
    <PageLayout heading="Server Error">
      <div className="flex flex-col gap-8 pb-12">
        <p className="text-3xl text-rose-500">Error: Server Not Reachable 😟</p>
        <p className="text-2xl text-slate-500">
          This part of ACT Labs require server to be running.{" "}
          <a
            href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280601/Getting-Started"
            target={"_blank"}
            className="text-sky-500 underline"
          >
            Learn more
          </a>
        </p>
      </div>
    </PageLayout>
  );
}

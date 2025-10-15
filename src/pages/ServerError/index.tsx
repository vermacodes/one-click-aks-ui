import { useEffect } from "react";
import ServerConfig from "../../components/Config/Server/ServerConfig";
import PageLayout from "../../layouts/PageLayout";

export default function ServerError() {
  useEffect(() => {
    document.title = "ACT Labs | Where is the server?";
  }, []);

  return (
    <PageLayout heading="Where is the server?">
      <div className="flex flex-col gap-8 pb-12">
        <div className="border-amber-700 dark:border-amber-400 bg-amber-700/20 dark:bg-amber-400/20 rounded-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-semibold">
              Server Connection Required
            </h3>
          </div>
          <p className="mb-3">
            ACT Labs requires a running server to provide lab environments and manage deployments. 
            The server handles resource provisioning, lab assignments, and infrastructure management.
          </p>
          <p className="text-sm">
            If you're seeing this message persistently, please check your server configuration below or contact support for assistance.
          </p>
        </div>
        <ServerConfig />
      </div>
    </PageLayout>
  );
}

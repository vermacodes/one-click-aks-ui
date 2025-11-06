import { useEffect, useState } from "react";
import ServerConfig from "../../components/Config/Server/ServerConfig";
import PageLayout from "../../layouts/PageLayout";

type Props = {
  hostPageHeading?: string;
};

export default function ServerError({
  hostPageHeading = "Please wait",
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "ACT Labs | Where is the server?";

    // Show loading for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLayout heading={hostPageHeading}>
        <p className="text-4xl">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout heading="Where is the server?">
      <div className="flex flex-col gap-8 pb-12">
        <div className="rounded-sm border border-amber-700 bg-amber-700/20 p-6 dark:border-amber-400 dark:bg-amber-400/20">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-semibold">
              Server Connection Required
            </h3>
          </div>
          <p className="mb-3">
            ACT Labs requires a running server to provide lab environments and
            manage deployments. The server handles resource provisioning, lab
            assignments, and infrastructure management.
          </p>
          <p className="text-sm">
            If you're seeing this message persistently, please check your server
            configuration below or contact support for assistance.
          </p>
        </div>
        <ServerConfig />
      </div>
    </PageLayout>
  );
}

import { useEffect } from "react";
import { FaSync } from "react-icons/fa";
import { useQueryClient } from "react-query";
import ManagedServers from "../../components/ManagedServer/ManagedServers";
import Button from "../../components/UserInterfaceComponents/Button";
import { useAdminGetAllManagedServers } from "../../hooks/useManagedServer";
import PageLayout from "../../layouts/PageLayout";

type Props = {};

export default function ManagedServersPage({}: Props) {
  const { data: managedServers } = useAdminGetAllManagedServers();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "ACT Labs | Managed Servers";
  }, []);

  if (!managedServers) {
    return null;
  }

  return (
    <PageLayout heading="Managed Servers">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-end gap-2">
          <Button
            variant="primary"
            onClick={() => queryClient.invalidateQueries("get-managed-servers")}
            aria-label="Refresh Managed Servers"
          >
            <span>
              <FaSync />
            </span>
            <span>Refresh</span>
          </Button>
        </div>
      </div>
      <ManagedServers />
    </PageLayout>
  );
}

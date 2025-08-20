import { ReactNode } from "react";
import { ManagedServer } from "../../../dataStructures";
import { useGetAllProfilesRedacted } from "../../../hooks/useProfile";
import ProfileDisplay from "../../Authentication/ProfileDisplay";
import Container from "../../UserInterfaceComponents/Container";
import ManagedServerAdminDestroyButton from "../ManagedServerAdminDestroyButton";
import ManagedServerAdminUnregisterButton from "../ManagedServerAdminUnregisterButton";
import ManagedServerDurationSinceLastActivity from "../ManagedServerDurationSinceLastActivity";
import ManagedServerDurationUntilDestroyed from "../ManagedServerDurationUntilDestroyed";
import ManagedServerIdleTimeout from "../ManagedServerIdleTimeout";
import ManagedServerStatus from "../ManagedServerStatus";
import ManagedServerUptime from "../ManagedServerUptime";
import ManagedServerVersion from "../ManagedServerVersion";

type Props = {
  managedServer: ManagedServer;
};

export default function ManagedServerCard({ managedServer }: Props) {
  const { data: profiles } = useGetAllProfilesRedacted();

  function getProfileByUserPrincipal(
    userPrincipal: string,
  ): ReactNode | string {
    const profile = profiles?.find(
      (profile) => profile.userPrincipal === userPrincipal,
    );
    if (!profile) {
      return userPrincipal;
    }
    return <ProfileDisplay profile={profile} size="small" />;
  }

  return (
    <Container additionalClasses="mb-4">
      <div className="flex">
        <div className="flex w-full justify-between">
          {getProfileByUserPrincipal(managedServer.userPrincipalName)}
          <div className="flex items-center divide-x-1 divide-gray-300 dark:divide-gray-600">
            <ManagedServerStatus managedServer={managedServer} />
            <ManagedServerUptime managedServer={managedServer} />
            <ManagedServerDurationSinceLastActivity
              managedServer={managedServer}
            />
            <ManagedServerIdleTimeout managedServer={managedServer} />
            <ManagedServerDurationUntilDestroyed
              managedServer={managedServer}
            />
            <ManagedServerVersion managedServer={managedServer} />
          </div>
        </div>
      </div>
      <div className="mt-16 flex gap-2">
        <ManagedServerAdminDestroyButton managedServer={managedServer} />
        <ManagedServerAdminUnregisterButton managedServer={managedServer} />
      </div>
    </Container>
  );
}

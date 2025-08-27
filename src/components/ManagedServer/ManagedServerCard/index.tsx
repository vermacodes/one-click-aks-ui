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

  // Highlight logic
  let highlight = false;
  if (managedServer.status === "Running") {
    const lastActivity = new Date(managedServer.lastActivityTime);
    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now.getTime() - lastActivity.getTime()) / 1000,
    );
    if (
      typeof managedServer.inactivityDurationInSeconds === "number" &&
      elapsedSeconds > managedServer.inactivityDurationInSeconds
    ) {
      highlight = true;
    }
  }

  const containerClasses = `mb-4${highlight ? " outline-rose-700 dark:outline-rose-400 outline-2" : ""}`;

  return (
    <Container additionalClasses={containerClasses}>
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

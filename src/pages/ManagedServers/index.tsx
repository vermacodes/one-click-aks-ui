import { ReactNode, useEffect } from "react";
import { FaSync } from "react-icons/fa";
import { useQueryClient } from "react-query";
import ProfileDisplay from "../../components/Authentication/ProfileDisplay";
import Button from "../../components/UserInterfaceComponents/Button";
import { useManagedServers } from "../../hooks/useManagedServer";
import { useGetAllProfilesRedacted } from "../../hooks/useProfile";
import PageLayout from "../../layouts/PageLayout";

type Props = {};

export default function ManagedServers({}: Props) {
	const { data: managedServers } = useManagedServers();
	const { data: profiles } = useGetAllProfilesRedacted();
	const queryClient = useQueryClient();

	useEffect(() => {
		document.title = "ACT Labs | Managed Servers";
	}, []);

	if (!managedServers) {
		return null;
	}

	function getProfileByUserPrincipal(userPrincipal: string): ReactNode | string {
		const profile = profiles?.find((profile) => profile.userPrincipal === userPrincipal);
		if (!profile) {
			return userPrincipal;
		}
		return <ProfileDisplay profile={profile} size="small" />;
	}

	return (
		<PageLayout heading="Managed Servers">
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-end gap-2">
					<Button variant="primary-text" onClick={() => queryClient.invalidateQueries("get-managed-servers")}>
						<span>
							<FaSync />
						</span>
						<span>Refresh</span>
					</Button>
				</div>
				<table className="h-full w-full table-auto border-separate space-x-2 overflow-auto bg-slate-50 py-2 dark:bg-slate-900">
					<thead>
						<tr>
							<th className="space-x-2 px-4 py-2 text-left">User</th>
							<th className="space-x-2 px-4 py-2 text-left">Status</th>
							{/* <th className="space-x-2 px-4 py-2 text-left">Auto Create</th> */}
							<th className="space-x-2 px-4 py-2 text-left">Auto Destroy</th>
							<th className="space-x-2 px-4 py-2 text-left">Duration Since Last Activity</th>
							<th className="space-x-2 px-4 py-2 text-left">Idle Timeout</th>
							<th className="space-x-2 px-4 py-2 text-left">Deployed At</th>
							<th className="space-x-2 px-4 py-2 text-left">Destroyed At</th>
							<th className="space-x-2 px-4 py-2 text-left">Up Duration</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{[...managedServers]
							.sort((a, b) => new Date(b.lastActivityTime).getTime() - new Date(a.lastActivityTime).getTime())
							.map((server) => (
								<tr key={server.userPrincipalId} className="hover:bg-slate-100 hover:dark:bg-slate-800">
									<td className="space-x-2 px-4 py-2">{getProfileByUserPrincipal(server.userPrincipalName)}</td>
									<td className="space-x-2 px-4 py-2">{server.status}</td>
									{/* <td className="space-x-2 px-4 py-2">{server.autoCreate ? "Enabled" : ""}</td> */}
									<td className="space-x-2 px-4 py-2">{server.autoDestroy ? "Enabled" : ""}</td>
									<td className="space-x-2 px-4 py-2">
										{(() => {
											const lastActivity = new Date(server.lastActivityTime);
											const now = new Date();
											const elapsedMs = now.getTime() - lastActivity.getTime();

											const seconds = Math.floor((elapsedMs / 1000) % 60);
											const minutes = Math.floor((elapsedMs / 1000 / 60) % 60);
											const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
											const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

											let result = "";
											if (days > 0) result += `${days}d `;
											if (hours > 0) result += `${hours}h `;
											if (minutes > 0) result += `${minutes}m `;
											result += `${seconds}s`;

											return result;
										})()}
									</td>
									<td className="space-x-2 px-4 py-2">
										{(() => {
											const totalSeconds = server.inactivityDurationInSeconds;
											const hours = Math.floor(totalSeconds / 3600);
											const minutes = Math.floor((totalSeconds % 3600) / 60);
											const seconds = totalSeconds % 60;

											return `${hours}h ${minutes}m ${seconds}s`;
										})()}
									</td>
									<td className="space-x-2 px-4 py-2">{new Date(server.deployedAtTime).toLocaleString()}</td>
									<td className="space-x-2 px-4 py-2">{new Date(server.destroyedAtTime).toLocaleString()}</td>
									<td className="space-x-2 px-4 py-2">
										{(() => {
											const deployedAt = new Date(server.deployedAtTime);
											const destroyedAt = server.destroyedAtTime ? new Date(server.destroyedAtTime) : new Date();
											let uptimeMs = destroyedAt.getTime() - deployedAt.getTime();

											if (uptimeMs < 0) {
												uptimeMs = new Date().getTime() - deployedAt.getTime();
											}

											const seconds = Math.floor((uptimeMs / 1000) % 60);
											const minutes = Math.floor((uptimeMs / 1000 / 60) % 60);
											const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
											const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

											let result = "";
											if (days > 0) result += `${days}d `;
											if (hours > 0) result += `${hours}h `;
											if (minutes > 0) result += `${minutes}m `;
											result += `${seconds}s`;

											return result;
										})()}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</PageLayout>
	);
}
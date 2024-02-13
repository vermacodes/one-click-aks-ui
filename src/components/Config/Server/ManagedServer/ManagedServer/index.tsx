import { useState } from "react";
import { FaCheckCircle, FaRedo, FaRocket, FaStopCircle, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ManagedServer, ServerHosting } from "../../../../../dataStructures";
import { useDeployManagedServer } from "../../../../../hooks/useDeployManagedServer";
import { useManagedServer } from "../../../../../hooks/useManagedServer";
import { useAuth } from "../../../../Context/AuthContext";
import Button from "../../../../UserInterfaceComponents/Button";
import Checkbox from "../../../../UserInterfaceComponents/Checkbox";
import CodeBlock from "../../../../UserInterfaceComponents/CodeBlock";
import Container from "../../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../../UserInterfaceComponents/GradientBorderContainer";
import ConfirmationModal from "../../../../UserInterfaceComponents/Modal/ConfirmationModal";
import Tooltip from "../../../../UserInterfaceComponents/Tooltip";
import ResetActionStatus from "../../ResetActionStatus";
import ResetServerCache from "../../ResetServerCache";
import ServerEndpoint from "../../ServerEndpoint";
import InactiveDuration from "../InactiveDuration";
import ManagedServerRegistration from "../ManagedServerRegistration";

type Props = {
	serverHosting: ServerHosting;
	setServerHosting: (serverHosting: ServerHosting) => void;
};

export default function ManagedServerComponent({ serverHosting, setServerHosting }: Props) {
	const [confirmUnregister, setConfirmUnregister] = useState<boolean>(false);
	const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);
	const [confirmAutoDestroyDisabled, setConfirmAutoDestroyDisabled] = useState<boolean>(false);

	const { graphResponse } = useAuth();
	const { data: managedServer, isLoading, isFetching, isError } = useManagedServer();
	const { lock, handleDeploy, handleDestroy, handleUpdate, handleUnregister } = useDeployManagedServer();

	function onDeployClick() {
		if (graphResponse === undefined) {
			toast.error("Failed to deploy managed server. User not authenticated.");
			return;
		}
		handleDeploy({
			userPrincipalName: graphResponse?.userPrincipalName,
			userPrincipalId: graphResponse?.id,
			logLevel: "-4",
		} as ManagedServer);
	}

	function onAutoDestroyClick() {
		if (!managedServer) {
			return;
		}

		if (managedServer.autoDestroy) {
			setConfirmAutoDestroyDisabled(true);
			return;
		}

		handleUpdate({ ...managedServer, autoDestroy: true });
	}

	if (managedServer === undefined || (managedServer && managedServer.status === "Unregistered")) {
		return <ManagedServerRegistration />;
	}

	return (
		<GradientBorderContainer>
			<Container
				title="Managed Server (Azure) 🆕"
				collapsible={true}
				hoverEffect={false}
				additionalClasses="border dark:border-slate-700 border-slate-300"
			>
				<div className="flex w-full flex-col flex-wrap gap-2">
					{graphResponse && managedServer && (
						<div className="flex flex-wrap items-center gap-2">
							<Tooltip message="Your server's endpoint. Its accessible on https" delay={500}>
								<div className="flex gap-4 rounded border border-slate-500 px-2 py-1">
									<span>
										{managedServer.endpoint !== "" ? managedServer.endpoint : "Deploy server to see endpoint here.."}
									</span>
								</div>
							</Tooltip>
							<Tooltip
								message={
									`Server Status as seen by Actlabs Hub. ` +
									`If this shows running and server is still not connecting that can be due to DNS sync delay. ` +
									`Try opening https://${managedServer.endpoint}/status in a different tab to ensure DNS resolves correctly and ` +
									`you get a response back. If thee is no response, give it a few minutes and try again.`
								}
								delay={500}
							>
								<div className="flex w-36 gap-4 rounded border border-slate-500 px-2 py-1">
									<div className="flex items-center gap-2">
										{managedServer.status === "Running" && <FaCheckCircle className="text-green-600" />}
										{managedServer.status}
									</div>
								</div>
							</Tooltip>
							<Checkbox
								key={"autoDeploy"}
								tooltipDelay={500}
								tooltipMessage="Server will be deployed again when you become active if it was automatically destroyed due to inactivity."
								label="Auto Deploy"
								id="autoDeploy"
								checked={managedServer.autoCreate}
								handleOnChange={() => handleUpdate({ ...managedServer, autoCreate: !managedServer.autoCreate })}
								disabled={isLoading || isFetching || isError || lock}
							/>
							<Checkbox
								key={"autoDestroy"}
								tooltipDelay={500}
								tooltipMessage="Server will be will be automatically destroyed if no activity for an hour. Not available for V2 servers."
								label="Auto Destroy"
								id="autoDestroy"
								checked={managedServer.autoDestroy}
								handleOnChange={onAutoDestroyClick}
								disabled={isLoading || isFetching || isError || lock || managedServer.version === "V2"}
							/>
							<InactiveDuration managedServer={managedServer} />
						</div>
					)}
					<ServerEndpoint serverHosting={serverHosting} setServerHosting={setServerHosting} />
					<div className="mt-8 flex flex-wrap gap-4">
						<Button
							variant="primary-text"
							disabled={lock || managedServer.status === "Running"}
							onClick={onDeployClick}
							tooltipMessage={
								managedServer.status === "Running"
									? "Server is already running. If server was just deployed and status is 'Not Running', Please wait for DNS sync to complete and refresh the page after a few minutes. Re-deploy will not help."
									: undefined
							}
						>
							<FaRocket /> Deploy
						</Button>
						<Button variant="secondary-text" disabled={lock} onClick={() => setConfirmDestroy(true)}>
							<FaTrash /> Destroy
						</Button>
						<Button
							variant="secondary-text"
							onClick={() => setConfirmUnregister(true)}
							tooltipMessage="Unregister the managed server."
							tooltipDelay={1000}
							disabled={lock}
						>
							<FaTimes /> Unregister
						</Button>
						<ResetServerCache
							variant="secondary-text"
							tooltipMessage="Reset server cache. This will clear all the cache on the server. Use this if you are facing issues with the server."
						>
							<FaRedo /> Reset Cache
						</ResetServerCache>
						<ResetActionStatus
							variant="secondary-text"
							tooltipMessage="Reset Action Status. This will stop any long running action on server."
						>
							<FaStopCircle /> Running Action
						</ResetActionStatus>
					</div>
				</div>
				{/* <p className="mt-4 w-full rounded border border-yellow-600 bg-yellow-600 bg-opacity-10 px-3 py-1 text-xs md:w-fit">
					✋ Managed servers change IP with each deployment. If server is running but not connected, wait 5 mins for DNS
					sync, then refresh; redeploy won't help.
				</p>
				<p className="mt-4 w-full rounded border border-yellow-600 bg-yellow-600 bg-opacity-10 px-3 py-1 text-xs md:w-fit">
					ARO labs only work in Self-Hosted (Docker) environment.
				</p> */}
				{confirmUnregister && (
					<ConfirmationModal
						title="Confirm Unregister"
						onConfirm={() => {
							setConfirmUnregister(false);
							handleUnregister();
						}}
						onClose={() => setConfirmUnregister(false)}
					>
						<p className="text-xl">Are you sure you want to unregister the managed server?</p>
						<ul className="ml-4 list-disc space-y-2">
							<li className="text-sm">
								<span className="font-bold underline">IMPORTANT</span> 👉 Unregistering managed server will only delete
								associated managed server record from our database and storage account from your subscription. It will{" "}
								<span className="font-bold text-rose-500 underline">NOT</span> remove any roles.
							</li>
							<li className="text-sm">
								<p className="mb-2">To completely remove all roles and resources, use following script.</p>
								<CodeBlock
									codeString="curl -o actlabs.sh -sLO https://raw.githubusercontent.com/vermacodes/actlabs-hub/main/scripts/unregister.sh; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
									copyEnabled={true}
								/>
							</li>
						</ul>
					</ConfirmationModal>
				)}
				{confirmDestroy && (
					<ConfirmationModal
						title="Confirm Destroy Server"
						onConfirm={() => {
							setConfirmDestroy(false);
							handleDestroy();
						}}
						onClose={() => setConfirmDestroy(false)}
					>
						<p className="text-xl">Are you sure you want to destroy the managed server?</p>
						<ul className="ml-4 list-disc space-y-2">
							<li className="text-sm">
								<span className="font-bold underline">IMPORTANT</span> 👉 Managed server (ACI) change IP with each
								deployment. If server is running but not connected, wait 5 mins for DNS sync, then refresh; redeploy
								won't help.
							</li>
							<li className="text-sm">
								Server wont be deployed again automatically and you have to manually deploy it.
							</li>
							<li className="text-sm">
								Any deployments which are set to be auto-destroyed will not be destroyed until server is manually
								deployed again..
							</li>
						</ul>
					</ConfirmationModal>
				)}
				{confirmAutoDestroyDisabled && (
					<ConfirmationModal
						title="Confirm Disable Auto Destroy"
						onConfirm={() => {
							setConfirmAutoDestroyDisabled(false);
							handleUpdate({ ...managedServer, autoDestroy: false });
						}}
						onClose={() => setConfirmAutoDestroyDisabled(false)}
					>
						<p className="text-xl">Are you sure you want to disable auto destroy?</p>
						<p className="text-sm">
							Please note that, when auto destroy is disabled, server wont be automatically destroyed and you may incur
							unnecessary cost.
						</p>
					</ConfirmationModal>
				)}
			</Container>
		</GradientBorderContainer>
	);
}

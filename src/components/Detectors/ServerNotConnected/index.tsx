import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ServerHosting } from "../../../dataStructures";
import { getDefaultServerHosting } from "../../../defaults";
import { useManagedServer } from "../../../hooks/useManagedServer";
import { useServerStatus } from "../../../hooks/useServerStatus";

export default function ServerNotConnected() {
	const [severHosting, setServerHosting] = useState<ServerHosting>(getDefaultServerHosting());
	const { data: serverStatus, isError } = useServerStatus();
	const { data: managedServer } = useManagedServer();

	useEffect(() => {
		const serverHostingFromLocalStorage = localStorage.getItem("serverHosting");
		if (serverHostingFromLocalStorage != undefined && serverHostingFromLocalStorage !== "") {
			setServerHosting(JSON.parse(serverHostingFromLocalStorage));
		}
	}, []);

	if (!isError && serverStatus && serverStatus.status === "OK") {
		return <></>;
	}

	if (severHosting.environment === "docker") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-red-500 bg-red-500 bg-opacity-20 p-2">
					<strong>🛑 Server Not Connected:</strong> Your self-hosted server is not available. Check your{" "}
					<Link to="/settings" className="cursor-pointer text-sky-600 underline">
						Settings
					</Link>{" "}
					to make sure server is deployed and <a className="underline">endpoint</a> is correct.
				</div>
			</div>
		);
	}

	if (managedServer === undefined || managedServer?.status === "Unregistered") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-red-500 bg-red-500 bg-opacity-20 p-2">
					<strong>🛑 Server Not Deployed:</strong> ACT Labs{" "}
					<a className="underline">requires user to deploy the server.</a> Goto{" "}
					<Link to="/settings" className="cursor-pointer text-sky-600 underline">
						Settings
					</Link>{" "}
					to register and deploy managed server or self-host on docker.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "Deploying") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-green-500 bg-green-500 bg-opacity-20 p-2">
					<strong>✅ Managed Server Deploying:</strong> Deployment is in progress. Page will auto reload once deployment
					completes.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "Destroyed") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-red-500 bg-red-500 bg-opacity-20 p-2">
					<strong>🛑 Server Not Deployed:</strong> You have destroyed managed server manually. Please deploy your
					managed server from{" "}
					<Link to="/settings" className="cursor-pointer text-sky-600 underline">
						Settings
					</Link>
					.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "AutoDestroyed" && managedServer?.autoCreate === true) {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-sky-500 bg-sky-500 bg-opacity-20 p-2">
					<strong>ℹ️ Managed Server Destroyed:</strong> Managed server was destroyed due to inactivity. It will be be
					deployed again in few seconds.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "AutoDestroyed" && managedServer?.autoCreate === false) {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-yellow-500 bg-yellow-500 bg-opacity-20 p-2">
					<strong>⚠️ Managed Server Destroyed:</strong> Managed server was destroyed due to inactivity and auto-deploy
					is not enabled. Deploy again from{" "}
					<Link to="/settings" className="cursor-pointer text-sky-600 underline">
						Settings
					</Link>
					.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "Running" && serverStatus?.status !== "OK") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-sky-500 bg-sky-500 bg-opacity-20 p-2">
					<strong>✋ Please Wait for DNS Sync:</strong> Not able to connect to{" "}
					<a className="underline">managed server</a>. This can happen when server is actually running but DNS is not in
					sync yet. Please wait for few minutes.
				</div>
			</div>
		);
	}

	if (managedServer?.status === "Registered" && serverStatus?.status !== "OK") {
		return (
			<div className="my-4">
				<div className="mt-2 rounded border border-sky-500 bg-sky-500 bg-opacity-20 p-2">
					<strong>☑️ Registration Completed:</strong> Managed server is now registered, Please use 'Deploy' button in
					Settings to deploy.
				</div>
			</div>
		);
	}

	return (
		<div className="my-4">
			<div className="mt-2 rounded border border-red-500 bg-red-500 bg-opacity-20 p-2">
				<strong>🛑 Unexpected Error:</strong> Something unexpected happened, please report this issue.
			</div>
		</div>
	);
}

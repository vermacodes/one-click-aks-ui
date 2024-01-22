import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ServerHosting } from "../../../dataStructures";
import { getDefaultServerHosting } from "../../../defaults";
import { useManagedServer } from "../../../hooks/useManagedServer";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

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
			<Alert variant="danger">
				<strong>🛑 Server Not Connected:</strong> Your self-hosted server is not available. Check your{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>{" "}
				to make sure server is deployed and <a className="underline">endpoint</a> is correct.
			</Alert>
		);
	}

	if (managedServer === undefined || managedServer?.status === "Unregistered") {
		return (
			<Alert variant="danger">
				<strong>🛑 Server Not Deployed:</strong> ACT Labs{" "}
				<a className="underline">requires user to deploy the server.</a> Goto{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>{" "}
				to register and deploy managed server or self-host on docker.
			</Alert>
		);
	}

	if (managedServer?.status === "Deploying") {
		return (
			<Alert variant="success">
				<strong>✅ Managed Server Deploying:</strong> Deployment is in progress. Page will auto reload once deployment
				completes.
			</Alert>
		);
	}

	if (managedServer?.status === "Destroyed") {
		return (
			<Alert variant="danger">
				<strong>🛑 Server Not Deployed:</strong> You have destroyed managed server manually. Please deploy your managed
				server from{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>
				.
			</Alert>
		);
	}

	if (managedServer?.status === "AutoDestroyed" && managedServer?.autoCreate === true) {
		return (
			<Alert variant="info">
				<strong>ℹ️ Managed Server Destroyed:</strong> Managed server was destroyed due to inactivity. It will be be
				deployed again in few seconds.
			</Alert>
		);
	}

	if (managedServer?.status === "AutoDestroyed" && managedServer?.autoCreate === false) {
		return (
			<Alert variant="warning">
				<strong>⚠️ Managed Server Destroyed:</strong> Managed server was destroyed due to inactivity and auto-deploy is
				not enabled. Deploy again from{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>
				.
			</Alert>
		);
	}

	if (managedServer?.status === "Running" && serverStatus?.status !== "OK") {
		return (
			<Alert variant="info">
				<strong>✋ Please Wait for DNS Sync:</strong> Not able to connect to <a className="underline">managed server</a>
				. This can happen when server is actually running but DNS is not in sync yet. Please wait for few minutes.
			</Alert>
		);
	}

	if (managedServer?.status === "Registered" && serverStatus?.status !== "OK") {
		return (
			<Alert variant="info">
				<strong>☑️ Registration Completed:</strong> Managed server is now registered, Please go to{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>{" "}
				and 'Deploy' button to deploy managed server.
			</Alert>
		);
	}

	return (
		<Alert variant="danger">
			<strong>🛑 Unexpected Error:</strong> Something unexpected happened, please report this issue.
		</Alert>
	);
}

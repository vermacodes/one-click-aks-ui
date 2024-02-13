// hooks/useDeployManagedServer.ts
import { isAxiosError } from "axios";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ManagedServer, ServerHosting } from "../dataStructures";
import {
	useCreateManagedServer,
	useDestroyManagedServer,
	useUnregister,
	useUpdateManagedServer,
} from "../hooks/useManagedServer";
import { useResetServerCache } from "../hooks/useServerCache";
import { isManagedServer } from "../utils/typeGuards";

export function useDeployManagedServer() {
	const [lock, setLock] = useState(false);
	const { mutateAsync: resetServerCache } = useResetServerCache();
	const { mutateAsync: deployManagedServer } = useCreateManagedServer();
	const { mutateAsync: updateManagedServer } = useUpdateManagedServer();
	const { mutateAsync: destroyManagedServer } = useDestroyManagedServer();
	const { mutateAsync: unregisterManagedServer } = useUnregister();

	const handleSwitch = (baseUrl: string) => {
		localStorage.setItem(
			"serverHosting",
			JSON.stringify({
				endpoint: baseUrl,
				environment: "azure",
			} as ServerHosting)
		);
		window.location.reload();
		resetServerCache().finally(() => {
			const queryClient = useQueryClient();
			queryClient.invalidateQueries();
		});
	};

	const handleDeploy = (managedServer: ManagedServer) => {
		setLock(true);
		const response = toast.promise(deployManagedServer(managedServer), {
			pending: "Deploying managed server...",
			success: {
				render(data) {
					if (isManagedServer(data?.data?.data)) {
						return `Managed server ${data?.data?.data?.status}.`;
					}
				},
				autoClose: 2000,
			},
			error: {
				render({ data }) {
					console.log("Data ", { data });
					if (isAxiosError(data)) {
						console.log("Axios Error Found");
						return `Failed to deploy managed server. ${data?.response?.data?.error}`;
					}
					return `Failed to deploy managed server.`;
				},
				autoClose: 5000,
			},
		});

		response
			.then((data) => {
				if (data.data === undefined) {
					return;
				}
				if (isManagedServer(data.data) && data.data.status === "Running") {
					handleSwitch(`https://${data.data.endpoint}/`);
				}
			})
			.finally(() => {
				setLock(false);
			});
	};

	const handleUpdate = (managedServer: ManagedServer) => {
		setLock(true);
		const response = toast.promise(updateManagedServer(managedServer), {
			pending: "Updating managed server...",
			success: {
				render: "Managed server updated.",
				autoClose: 2000,
			},
			error: {
				render: "Failed to update managed server.",
				autoClose: 5000,
			},
		});

		response.finally(() => {
			setLock(false);
		});
	};

	const handleDestroy = () => {
		setLock(true);
		const response = toast.promise(destroyManagedServer, {
			pending: "Destroying managed server...",
			success: {
				render() {
					return `Managed server Destroyed.`;
				},
				autoClose: 2000,
			},
			error: {
				render({ data }) {
					if (isAxiosError(data)) {
						console.log("Axios Error Found");
						return `Failed to destroy managed server. ${data?.response?.data?.error}`;
					}
					return `Failed to destroy managed server.`;
				},
				autoClose: 5000,
			},
		});

		response.finally(() => {
			setLock(false);
		});
	};

	const handleUnregister = () => {
		setLock(true);
		const response = toast.promise(unregisterManagedServer, {
			pending: "Unregistering managed server...",
			success: {
				render(data) {
					if (isManagedServer(data?.data?.data)) {
						return `Managed server unregistered.`;
					}
				},
				autoClose: 2000,
			},
			error: {
				render({ data }) {
					console.log("Data ", { data });
					if (isAxiosError(data)) {
						console.log("Axios Error Found");
						return `Failed to unregister managed server. ${data?.response?.data?.error}`;
					}
					return `Failed to unregister managed server.`;
				},
				autoClose: 5000,
			},
		});

		response.finally(() => {
			setLock(false);
			window.location.reload();
		});
	};

	return { lock, handleDeploy, handleUpdate, handleDestroy, handleUnregister };
}

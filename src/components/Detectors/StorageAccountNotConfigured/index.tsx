import { useEffect } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { useServerStatus } from "../../../hooks/useServerStatus";
import { useGetStorageAccount } from "../../../hooks/useStorageAccount";
import Alert from "../../UserInterfaceComponents/Alert";

export default function StorageAccountNotConfigured() {
	const { data: serverStatus, isError } = useServerStatus();
	const {
		data: storageAccount,
		isLoading: getStorageAccountLoading,
		isFetching: fetchingStorageAccount,
		refetch: getStorageAccount,
	} = useGetStorageAccount();

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (!getStorageAccountLoading && !fetchingStorageAccount && (!storageAccount || storageAccount.name === "")) {
			interval = setInterval(() => {
				getStorageAccount();
			}, 2000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [getStorageAccountLoading, fetchingStorageAccount, storageAccount]);

	if (isError || serverStatus?.status !== "OK") {
		return null;
	}

	if (getStorageAccountLoading || fetchingStorageAccount || (storageAccount && storageAccount.name !== "")) {
		return null;
	}

	return (
		<Alert variant="info">
			<div className="flex items-center gap-2">
				<TbFidgetSpinner className="animate-spin" />
				<strong>Fetching Storage account</strong> Please wait...
			</div>
		</Alert>
	);
}

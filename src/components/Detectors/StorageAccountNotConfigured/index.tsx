import { useServerStatus } from "../../../hooks/useServerStatus";
import { useConfigureStorageAccount, useGetStorageAccount } from "../../../hooks/useStorageAccount";
import Alert from "../../UserInterfaceComponents/Alert";

export default function StorageAccountNotConfigured() {
	const { data: serverStatus, isError } = useServerStatus();
	const {
		data: storageAccount,
		isLoading: getStorageAccountLoading,
		isFetching: fetchingStorageAccount,
	} = useGetStorageAccount();

	const { refetch: configureStorageAccount, isLoading: configureStorageAccountLoading } = useConfigureStorageAccount();

	if (isError || serverStatus?.status !== "OK") {
		return null;
	}

	if (
		configureStorageAccountLoading ||
		getStorageAccountLoading ||
		fetchingStorageAccount ||
		(storageAccount && storageAccount.name !== "")
	) {
		return null;
	}

	return (
		<Alert variant="warning">
			<strong>⚠️ Storage Account Issue Detected:</strong> It seems storage account is not configured.{" "}
			<a href="#" onClick={() => configureStorageAccount()} className="cursor-pointer text-sky-600 underline">
				Configure
			</a>{" "}
			now. Use Help & Feedback if the problem continues.
		</Alert>
	);
}

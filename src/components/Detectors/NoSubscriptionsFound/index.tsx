import { useAccount } from "../../../hooks/useAccount";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

export default function NoSubscriptionsFound() {
	const { data: serverStatus, isError } = useServerStatus();
	const {
		data: accounts,
		refetch: getAccounts,
		isLoading: accountsLoading,
		isFetching: accountsFetching,
	} = useAccount();

	if ((accounts && accounts?.length > 0) || accountsLoading || accountsFetching) {
		return null;
	}

	if (isError || serverStatus?.status !== "OK") {
		return null;
	}

	return (
		<Alert variant="warning">
			<strong>⚠️ No Subscriptions Found:</strong> No Azure Subscriptions were loaded.{" "}
			<a href="#" onClick={() => getAccounts()} className="cursor-pointer text-sky-600 underline">
				Refetch
			</a>{" "}
			now. Use Help & Feedback if the problem continues.
		</Alert>
	);
}

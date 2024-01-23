import { useEffect } from "react";
import { ImSpinner10 } from "react-icons/im";
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

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (!accountsLoading && !accountsFetching && (!accounts || accounts.length === 0)) {
			interval = setInterval(() => {
				getAccounts();
			}, 2000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [accountsLoading, accountsFetching, accounts]);

	if ((accounts && accounts?.length > 0) || accountsLoading || accountsFetching) {
		return null;
	}

	if (isError || serverStatus?.status !== "OK") {
		return null;
	}

	return (
		<Alert variant="info">
			<div className="flex items-center gap-2">
				<ImSpinner10 className="animate-spin" />
				<strong>Fetching Subscription</strong> Please wait...
			</div>
		</Alert>
	);
}

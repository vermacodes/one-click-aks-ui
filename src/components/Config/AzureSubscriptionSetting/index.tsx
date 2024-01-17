import { useDefaultAccount } from "../../../hooks/useDefaultAccount";
import Container from "../../UserInterfaceComponents/Container";

export default function AzureSubscriptionSetting() {
	const { defaultAccount } = useDefaultAccount();

	return (
		<Container title="Azure Subscription" collapsible={true}>
			<div className="flex w-full flex-col gap-2 gap-x-2 py-2">
				{/* <AzureSubscription /> */}
				<div className="w-full rounded border border-slate-500 p-2">
					<pre className="whitespace-pre-wrap break-words text-sm">{JSON.stringify(defaultAccount, null, 4)}</pre>
				</div>
				<p className="text-xs">
					To change the subscription, re-deploy the server in the new subscription and make sure the endpoint is
					updated.
				</p>
			</div>
		</Container>
	);
}

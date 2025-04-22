import { useDefaultAccount } from "../../../hooks/useDefaultAccount";
import Container from "../../UserInterfaceComponents/Container";
import Footnote from "../../UserInterfaceComponents/Footnote";

export default function AzureSubscription() {
  const { defaultAccount } = useDefaultAccount();

  return (
    <Container title="Azure Subscription" collapsible={true}>
      <div className="flex w-full flex-col gap-2 gap-x-2 py-2">
        {/* <AzureSubscription /> */}
        <div className="w-full rounded-sm border border-slate-500 p-2">
          <pre className="text-sm break-words whitespace-pre-wrap">
            {JSON.stringify(defaultAccount, null, 4)}
          </pre>
        </div>
        <Footnote>
          <p>
            To change the subscription, unregister the current subscription and
            register a new one.
          </p>
        </Footnote>
      </div>
    </Container>
  );
}

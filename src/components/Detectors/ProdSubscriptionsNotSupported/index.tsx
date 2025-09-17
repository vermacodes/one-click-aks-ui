import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ServerHosting } from "../../../dataStructures";
import {
  defaultLinkTextStyle,
  getDefaultServerHosting,
} from "../../../defaults";
import { useManagedServer } from "../../../hooks/useManagedServer";
import Alert from "../../UserInterfaceComponents/Alert";

export default function ProdSubscriptionsNotSupported() {
  const [read, setRead] = useState(false);

  const [severHosting] = useState<ServerHosting>(getDefaultServerHosting());
  const { data: managedServer } = useManagedServer();

  if (read) {
    return <></>;
  }

  if (
    !managedServer ||
    severHosting.environment === "docker" ||
    managedServer?.version === "V3" ||
    managedServer?.status === "Unregistered"
  ) {
    return <></>;
  }

  return (
    <Alert variant="warning">
      <div className="flex justify-between">
        <div className="flex-row">
          <strong>
            ⚠️ The Managed Server cannot be used for Production Subscriptions.
          </strong>{" "}
          <span>
            Please consider switching to an FDPO Subscription or hosting the
            server yourself. To switch to an FDPO Subscription, you'll need to
            unregister the server and register it again under the new
            subscription. If you need assistance,{" "}
            <a
              className={defaultLinkTextStyle}
              href={`${window.location.origin}/ui/feedback`}
            >
              click here
            </a>
            .
          </span>
        </div>
        <button
          onClick={() => setRead(true)}
          className="text-xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </Alert>
  );
}

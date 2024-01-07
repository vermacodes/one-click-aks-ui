import { useState } from "react";
import { FaCog, FaComments, FaKey } from "react-icons/fa";
import { useDefaultAccount } from "../../../hooks/useDefaultAccount";
import DefaultSubscription from "../../../modals/DefaultSubscription";
import LoginButton from "../../Authentication/LoginButton";
import Tooltip from "../../UserInterfaceComponents/Tooltip";
import NavItem from "../NavItem";

export default function FixedPages() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { defaultAccount } = useDefaultAccount();

  return (
    <div className="h-fit w-full flex-col p-4">
      <ul className="md:text-l flex w-full flex-col justify-start gap-y-1 text-sm lg:text-xl">
        {defaultAccount && (
          <li>
            <Tooltip
              message="This is the selected Azure subscription. To change redeploy server in correct subscription."
              delay={1000}
              direction="top"
            >
              <button
                className="flex h-full w-full items-center justify-start gap-2 rounded py-3 px-4 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800"
                onClick={() => setShowSubscriptionModal(true)}
              >
                <span className="-rotate-45">
                  <FaKey />
                </span>{" "}
                {defaultAccount.name}
              </button>
            </Tooltip>
          </li>
        )}
        <NavItem
          icon={<FaCog />}
          label="Settings"
          to={"/settings"}
          toolTipMessage="Manage actlabs configurations and Your server."
        />
        <NavItem
          icon={<FaComments />}
          label="Help & Feedback"
          to={"/feedback"}
          toolTipMessage="Need help or have feedback? Please fill out the form and we will get back to you."
        />
        <li>
          <LoginButton />
        </li>
      </ul>
      {showSubscriptionModal && <DefaultSubscription onClick={() => setShowSubscriptionModal(false)} />}
    </div>
  );
}

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterSubscription } from "../../../../../hooks/useManagedServer";
import { subscriptionIdSchema } from "../../../../../zodSchemas";
import Button from "../../../../UserInterfaceComponents/Button";
import CodeBlock from "../../../../UserInterfaceComponents/CodeBlock";
import Container from "../../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../../UserInterfaceComponents/GradientBorderContainer";

type Props = {};

export default function ManagedServerRegistration({}: Props) {
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const { mutateAsync: registerManagedServer } = useRegisterSubscription();
  const handleRegistration = () => {
    if (!subscriptionIdSchema.safeParse(subscriptionId).success) {
      toast.error("Invalid subscription id");
      return;
    }
    toast.promise(registerManagedServer(subscriptionId), {
      pending: "Registering managed server...",
      success: {
        render(data: any) {
          return `Managed server registered.`;
        },
        autoClose: 2000,
      },
      error: {
        render(data: any) {
          return `Failed to register managed server.`;
        },
        autoClose: 5000,
      },
    });
  };

  return (
    <GradientBorderContainer>
      <Container
        title="Managed Server Registration (Preview)"
        collapsible={true}
        hoverEffect={false}
        additionalClasses="border dark:border-slate-700 border-slate-300"
      >
        <div className="flex flex-col gap-2">
          {/* <ManagedServerRegistrationCommand /> */}
          <p>
            To use managed server, one time registration is required. Follow the steps below to complete registration.
          </p>
          <ol className="ml-6 list-decimal">
            <li className="py-1">
              Open Azure Cloud Shell.
              <Button variant="primary" onClick={() => window.open("https://shell.azure.com", "_blank")}>
                <SiMicrosoftazure className="h-full" /> {"Launch Cloud Shell"}
              </Button>
              <p className="mt-2 text-sm text-slate-500">
                You can also run these steps on your system if you use linux (WSL) and have latest version of Azure CLI
                installed. We recommend using Azure Cloud Shell.
              </p>
            </li>
            <li className="py-1">Ensure Azure Cloud Shell is running in 'Bash' mode</li>
            <li className="py-1">
              Ensure that you've selected correct default account by running following command.
              <CodeBlock codeString="az account show" copyEnabled={true} />
            </li>
            <li className="py-1">
              Run following command in Azure Cloud Shell to complete configurations.
              <CodeBlock
                codeString="curl -o actlabs.sh -sLO https://aka.ms/ActlabsManagedServer; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
                copyEnabled={true}
              />
            </li>
            <li className="py-1">
              {" "}
              Copy subscription id from script's output, paste it in the input box below and click on Register button.
              If you run into issues{" "}
              <Link to={"/feedback"} className="text-sky-500 underline">
                let us know
              </Link>
              .
            </li>
          </ol>
          <div className="mt-8 flex gap-4">
            <input
              className="w-full rounded border border-slate-500 bg-inherit p-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 md:w-96"
              placeholder="Paste subscription id from script output here..."
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
            ></input>
            <Button variant="primary" onClick={handleRegistration}>
              <FaCheck /> Register
            </Button>
          </div>
        </div>
      </Container>
    </GradientBorderContainer>
  );
}

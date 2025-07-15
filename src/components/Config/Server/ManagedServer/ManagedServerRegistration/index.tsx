import { SiMicrosoftazure } from "react-icons/si";
import Button from "../../../../UserInterfaceComponents/Button";
import CodeBlock from "../../../../UserInterfaceComponents/CodeBlock";
import Container from "../../../../UserInterfaceComponents/Container";
import GradientBorderContainer from "../../../../UserInterfaceComponents/GradientBorderContainer";

type Props = {};

export default function ManagedServerRegistration({}: Props) {
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
            To use managed server, one time registration is required. Follow the
            steps below to complete registration.
          </p>
          <ol className="ml-6 list-decimal">
            <li className="py-1">
              Open Azure Cloud Shell.
              <Button
                variant="primary"
                onClick={() => window.open("https://shell.azure.com", "_blank")}
              >
                <SiMicrosoftazure
                  className="h-full"
                  aria-label="Microsoft Azure Logo"
                />{" "}
                {"Launch Cloud Shell"}
              </Button>
              <p className="mt-2 text-sm text-slate-500">
                You can also run these steps on your system if you use linux
                (WSL) and have latest version of Azure CLI installed. We
                recommend using Azure Cloud Shell.
              </p>
            </li>
            <li className="py-1">
              Ensure Azure Cloud Shell is running in 'Bash' mode
            </li>
            <li className="py-1">
              Ensure that you've selected correct default account by running
              following command.
              <CodeBlock codeString="az account show" copyEnabled={true} />
            </li>
            <li className="py-1">
              Run following command in Azure Cloud Shell to complete
              configurations.
              <CodeBlock
                codeString="curl -o actlabs.sh -sLO https://aka.ms/ActlabsManagedServer; chmod +x actlabs.sh; ./actlabs.sh; rm actlabs.sh"
                copyEnabled={true}
              />
            </li>
          </ol>
        </div>
      </Container>
    </GradientBorderContainer>
  );
}

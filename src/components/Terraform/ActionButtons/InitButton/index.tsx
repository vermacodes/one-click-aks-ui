import { v4 as uuid } from "uuid";
import { ButtonVariant } from "../../../../dataStructures";
import { useLab } from "../../../../hooks/useLab";
import { useSelectedDeployment } from "../../../../hooks/useSelectedDeployment";
import { useTerraformOperation } from "../../../../hooks/useTerraformOperation";
import { useWebSocketContext } from "../../../Context/WebSocketContext";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
  variant: ButtonVariant;
  children: React.ReactNode;
  ariaLabel: string;
};

export default function InitButton({ variant, children, ariaLabel }: Props) {
  const { actionStatus } = useWebSocketContext();
  const { data: lab } = useLab();
  const { selectedDeployment } = useSelectedDeployment();
  const { onClickHandler } = useTerraformOperation();

  return (
    <Button
      variant={variant}
      onClick={() =>
        onClickHandler({
          operationType: "init",
          lab: lab,
          deployment: selectedDeployment,
          operationId: uuid(),
        })
      }
      disabled={actionStatus.inProgress}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

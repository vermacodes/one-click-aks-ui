import { useContext } from "react";
import { FaExpand, FaTrashAlt } from "react-icons/fa";
import { useSetLogs } from "../../../hooks/useLogs";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { WebSocketContext } from "../../Context/WebSocketContext";
import DeploymentStatus from "../../Deployments/DeploymentStatus";
import Button from "../../UserInterfaceComponents/Button";
import Checkbox from "../../UserInterfaceComponents/Checkbox";
type Props = {
  autoScroll: boolean;
  handleAutoScrollChange: () => void;
  setFullScreen: (args: boolean) => void;
  children: React.ReactNode;
};

export default function TerminalWindow({
  autoScroll,
  handleAutoScrollChange,
  setFullScreen,
  children,
}: Props) {
  const { mutate: setLogs } = useSetLogs();
  const { actionStatus } = useContext(WebSocketContext);
  const { selectedDeployment } = useSelectedDeployment();

  return (
    <div
      className="mt-4 mb-4 flex w-full flex-col overflow-auto pt-1 sm:max-h-[80vh]"
      //style={{ maxHeight: "80vh" }}
    >
      <div className="mb-1 flex flex-wrap items-center justify-end gap-2 divide-slate-500 sm:divide-x">
        <div className="pr-4">
          {selectedDeployment && (
            <DeploymentStatus deployment={selectedDeployment} />
          )}
        </div>
        <div className="px-2">
          <Checkbox
            id="terminal-auto-scroll"
            label="Auto Scroll"
            disabled={false}
            checked={autoScroll}
            handleOnChange={handleAutoScrollChange}
            aria-label="Auto Scroll"
          />
        </div>
        <Button
          variant="text"
          disabled={actionStatus.inProgress}
          onClick={() => setLogs({ logs: "" })}
          aria-label="Clear logs"
          className="mr-2"
        >
          <FaTrashAlt /> Clear Logs
        </Button>
        <Button
          variant="text"
          onClick={() => setFullScreen(true)}
          aria-label="Maximize Terminal"
          className="mr-1"
        >
          <FaExpand /> Maximize
        </Button>
      </div>
      {children}
    </div>
  );
}

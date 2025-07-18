import { useContext } from "react";
import { FaCompress, FaTrashAlt } from "react-icons/fa";
import { getUIStateColors } from "../../../defaults";
import { useSetLogs } from "../../../hooks/useLogs";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import { cn } from "../../../utils/cn";
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

export default function TerminalFullScreen({
  autoScroll,
  handleAutoScrollChange,
  setFullScreen,
  children,
}: Props) {
  const { mutate: setLogs } = useSetLogs();
  const { actionStatus } = useContext(WebSocketContext);
  const { selectedDeployment } = useSelectedDeployment();

  return (
    <div className="max-w-ful -gap-x-2 fixed inset-0 z-20 flex max-h-full justify-center">
      <div
        className="scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 w-screen gap-y-2 p-0 dark:divide-slate-700"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={cn(
            "sticky top-0 -mb-10 flex items-center justify-end gap-2 divide-x divide-slate-500 border-b p-2",
            getUIStateColors({}),
          )}
        >
          <div className="px-2">
            {selectedDeployment && (
              <DeploymentStatus deployment={selectedDeployment} />
            )}
          </div>
          <div className="pr-2">
            <Checkbox
              id="terminal-auto-scroll"
              label="Auto Scroll"
              disabled={false}
              checked={autoScroll}
              handleOnChange={handleAutoScrollChange}
            />
          </div>
          <Button
            variant="text"
            disabled={actionStatus.inProgress}
            onClick={() => setLogs({ logs: "" })}
            className="mr-2"
          >
            <FaTrashAlt /> Clear Logs
          </Button>
          <Button variant="text" onClick={() => setFullScreen(false)}>
            <FaCompress /> Minimize
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

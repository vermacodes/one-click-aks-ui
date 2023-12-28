import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useServerStatus } from "../../../../hooks/useServerStatus";
import Container from "../../../UserInterfaceComponents/Container";

export default function ServerStatus() {
  const { data: serverStatus, isError } = useServerStatus();
  return (
    <Container title="Status" collapsible={true} hoverEffect={false} additionalClasses="border dark:border-slate-700 border-slate-300">
      <div className="flex justify-end gap-x-2 divide-x-2">
        {!isError && serverStatus && serverStatus.status === "OK" ? (
          <div className="flex items-center gap-x-2">
            <span className="text-green-500">
              <FaCheckCircle />{" "}
            </span>
            Running
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <span className="text-rose-500">
              <FaExclamationCircle />{" "}
            </span>
            Not Running
          </div>
        )}
        {!isError && serverStatus && <p className="pl-2">Version: {serverStatus.version}</p>}
      </div>
    </Container>
  );
}

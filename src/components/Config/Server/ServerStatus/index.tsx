import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import {
  defaultUIErrorTextColor,
  defaultUISuccessTextColor,
} from "../../../../defaults";
import { useServerStatus } from "../../../../hooks/useServerStatus";

export default function ServerStatus() {
  const { data: serverStatus, isError } = useServerStatus();
  return (
    <div className="flex justify-end gap-x-2 divide-x-2">
      {!isError && serverStatus && serverStatus.status === "OK" ? (
        <div className="flex items-center gap-x-2 px-2">
          <span className={defaultUISuccessTextColor}>
            <FaCheckCircle />{" "}
          </span>
          Connected
        </div>
      ) : (
        <div className="flex items-center gap-x-2 px-2">
          <span className={defaultUIErrorTextColor}>
            <FaExclamationCircle />{" "}
          </span>
          Not Connected
        </div>
      )}
      {!isError && serverStatus && <p>Version: {serverStatus.version}</p>}
    </div>
  );
}

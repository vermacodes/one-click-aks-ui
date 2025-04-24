import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useServerStatus } from "../../../../hooks/useServerStatus";

export default function ServerStatus() {
  const { data: serverStatus, isError } = useServerStatus();
  return (
    <div className="flex justify-end gap-x-2 divide-x-2">
      {!isError && serverStatus && serverStatus.status === "OK" ? (
        <div className="flex items-center gap-x-2 px-2">
          <span className="text-green-500">
            <FaCheckCircle />{" "}
          </span>
          Connected
        </div>
      ) : (
        <div className="flex items-center gap-x-2 px-2">
          <span className="text-rose-500">
            <FaExclamationCircle />{" "}
          </span>
          Not Connected
        </div>
      )}
      {!isError && serverStatus && <p>Version: {serverStatus.version}</p>}
    </div>
  );
}

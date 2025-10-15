import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useWebSocketContext } from "../../context/WebSocketContext";

export default function ServerNotification() {
  const { serverNotification, setServerNotification } = useWebSocketContext();
  const [toastShown, setToastShown] = useState(false);

  const queryClient = useQueryClient();
  const invalidateQueriesList = ["list-deployments"];

  useEffect(() => {
    if (!toastShown && serverNotification.message !== "") {
      toast(serverNotification.message, {
        type: serverNotification.type,
        autoClose:
          serverNotification.autoClose == 0
            ? false
            : serverNotification.autoClose,
      });
      setToastShown(true);
      queryClient.invalidateQueries(invalidateQueriesList);
    }
  }, [serverNotification, toastShown]);

  useEffect(() => {
    if (toastShown) {
      setServerNotification({ ...serverNotification, message: "" });
      setToastShown(false);
    }
  }, [toastShown, setServerNotification, serverNotification]);

  return null;
}

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWebSocketContext } from "../../context/WebSocketContext";

export default function ServerNotification() {
  const { serverNotification, setServerNotification } = useWebSocketContext();
  const [toastShown, setToastShown] = useState(false);

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

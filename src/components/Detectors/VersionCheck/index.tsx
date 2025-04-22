import { Link } from "react-router-dom";
import { defaultLinkTextStyle } from "../../../defaults";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

export default function VersionCheck() {
  const { data, isFetching, isError } = useServerStatus();

  //check if version in status is greater than a given number. if so, return true else return false
  function versionCheck(version: string) {
    //if version is undefined, return false
    if (version === undefined || version === "") {
      return false;
    }

    const versionNumber = parseInt(version);
    return versionNumber >= 20240617;
  }

  if (data === undefined || isFetching) {
    return <></>;
  }

  if (isError || data.status !== "OK") {
    return <></>;
  }

  if (versionCheck(data.version)) {
    return <></>;
  }

  return (
    <Alert variant="warning">
      <strong>⚠️ New Version Released:</strong> Goto{" "}
      <Link to="/settings" className={defaultLinkTextStyle}>
        Settings
      </Link>
      , and follow steps to deploy server again.
    </Alert>
  );
}

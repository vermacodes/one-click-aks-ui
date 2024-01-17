import { Link } from "react-router-dom";
import { useServerStatus } from "../../../hooks/useServerStatus";

export default function VersionCheck() {
	const { data, isFetching, isError } = useServerStatus();

	//check if version in status is greater than a given number. if so, return true else return false
	function versionCheck(version: string) {
		//if version is undefined, return false
		if (version === undefined || version === "") {
			return false;
		}

		const versionNumber = parseInt(version);
		return versionNumber >= 20240117;
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
		<div className="my-4">
			<div className="mt-2 rounded border border-red-500 bg-red-500 bg-opacity-20 p-2">
				<strong>New Version Released:</strong> Goto{" "}
				<Link to="/settings" className="cursor-pointer text-sky-600 underline">
					Settings
				</Link>
				, and follow steps to deploy server again.
			</div>
		</div>
	);
}

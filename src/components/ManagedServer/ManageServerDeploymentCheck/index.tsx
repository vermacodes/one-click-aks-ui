import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useManagedServer } from "../../../hooks/useManagedServer";
import { useServerStatus } from "../../../hooks/useServerStatus";

const checks = [
	{ id: "check1", message: "Performing check 1...", doneMessage: "Check 1 complete." },
	{ id: "check2", message: "Performing check 2...", doneMessage: "Check 2 complete." },
	{ id: "check3", message: "Performing check 3...", doneMessage: "Check 3 complete." },
];

export default function ManagedServerDeploymentCheck() {
	const [currentCheck, setCurrentCheck] = useState(0);
	const [message, setMessage] = useState<string>("");

	const { data: serverStatus, isError } = useServerStatus();
	const { data: managedServer } = useManagedServer();

	const performCheck = async (check: any) => {
		setMessage(check.message);
		// Simulate a check taking some time to complete
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setMessage(check.doneMessage);
		setCurrentCheck((prev) => prev + 1);
	};

	useEffect(() => {
		if (currentCheck < checks.length) {
			performCheck(checks[currentCheck]);
		}
	}, [currentCheck]);

	return (
		<div className="flex items-center gap-2">
			<span className="animate-spin">
				<FaSpinner />
			</span>
			<span>{message}</span>
		</div>
	);
}

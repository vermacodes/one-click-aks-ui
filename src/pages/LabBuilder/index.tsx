import { useEffect } from "react";
import Builder from "../../components/Builder/Builder";
import SelectedDeployment from "../../components/Deployments/SelectedDeployment";
import Terminal from "../../components/Terminal/Terminal";
import { useLab } from "../../hooks/useLab";
import { useServerStatus } from "../../hooks/useServerStatus";
import PageLayout from "../../layouts/PageLayout";
import ServerError from "../ServerError";

export default function LabBuilder() {
	const { data: serverStatus } = useServerStatus();
	const { data: lab } = useLab();

	useEffect(() => {
		document.title = "ACT Labs | Lab Builder";
	}, []);

	if (serverStatus?.status !== "OK") {
		return <ServerError />;
	}

	if (lab === undefined || lab === null) {
		return (
			<PageLayout heading="Lab Builder">
				<p className="text-4xl">Loading...</p>
			</PageLayout>
		);
	}

	return (
		<PageLayout heading={lab && lab.name !== "" ? "Lab Builder - " + lab.name : "Lab Builder - New Lab"}>
			<SelectedDeployment sticky={false} />
			<Builder />
			<Terminal />
		</PageLayout>
	);
}

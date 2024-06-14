import { useEffect } from "react";
import PageLayout from "../../layouts/PageLayout";

export default function Feedback() {
	useEffect(() => {
		document.title = "ACT Labs | Feedback";
	}, []);

	return (
		<PageLayout>
			<iframe
				className="h-screen w-full max-w-full overflow-hidden py-4"
				src="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyB_Mn8cPhhPoGtsF2A-X8pUQ1FUNTMwVDdTNUFEMllYWFUwSllYWFMyVy4u&embed=true"
			/>
		</PageLayout>
	);
}

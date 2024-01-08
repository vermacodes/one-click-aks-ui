import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import SelectedDeployment from "../../components/Deployments/SelectedDeployment";
import LabCard from "../../components/Lab/LabCard";
import Terminal from "../../components/Terminal";
import FilterTextBox from "../../components/UserInterfaceComponents/FilterTextBox";
import { LabType } from "../../dataStructures";
import { useGetLabs } from "../../hooks/useGetLabs";
import LabGridLayout from "../../layouts/LabGridLayout";
import PageLayout from "../../layouts/PageLayout";

export default function LabsGridPage() {
	const { type } = useParams<{ type: LabType }>();
	const location = useLocation();
	const navigate = useNavigate();
	const urlParams = new URLSearchParams(location.search);
	const [filterTerm, setFilterTerm] = useState(urlParams.get("filter") || "");
	const [pageHeading, setPageHeading] = useState("Labs");
	const { getLabsByType } = useGetLabs();

	if (!type) {
		return null;
	}

	const { labs, isLoading } = getLabsByType({ labType: type });

	const [debouncedFilterTerm] = useDebounce(filterTerm, 500); // Debounce for 500ms

	useEffect(() => {
		// Update the URL with the filter term when it changes
		const params = new URLSearchParams(location.search);
		if (debouncedFilterTerm) {
			params.set("filter", debouncedFilterTerm);
		} else {
			params.delete("filter");
		}
		navigate("." + (params.toString() ? "?" + params.toString() : ""), { replace: true });
	}, [debouncedFilterTerm]);

	useEffect(() => {
		if (type.endsWith("lab")) {
			setPageHeading(type.charAt(0).toUpperCase() + type.slice(1).replace(/lab$/, " Labs"));
		} else if (type.endsWith("case")) {
			setPageHeading(type.charAt(0).toUpperCase() + type.slice(1).replace(/case$/, " Cases"));
		} else if (type.endsWith("assignment")) {
			setPageHeading("Assigned Readiness Labs");
		} else if (type.endsWith("challenge")) {
			setPageHeading("Challenges");
		} else {
			setPageHeading("My Saved Labs (Deprecated) - Use Private Labs");
		}

		// Reset the filter term when the type changes
		setFilterTerm(urlParams.get("filter") || "");

		document.title = "ACT Labs | " + pageHeading;
	}, [type, pageHeading]);

	const handleSearchChange = (value: string) => setFilterTerm(value);

	const filteredLabs = labs?.filter((lab) =>
		Object.values(lab).some((value) => value?.toString().toLowerCase().includes(filterTerm.toLowerCase()))
	);

	if (isLoading)
		return (
			<PageLayout heading={pageHeading}>
				<p className="text-4xl">Loading...</p>
			</PageLayout>
		);

	if (!labs?.length) {
		return (
			<PageLayout heading={pageHeading}>
				<div className="flex flex-col gap-4">
					<p className="text-4xl">No {pageHeading.toLowerCase()} found!</p>
					<p>There is nothing to show here, some possible reasons -</p>
					<ul className="list-inside list-disc">
						<li>You have not created and saved any labs yet.</li>
						<li>You have no assignments or challenges.</li>
						<li>You don't have access to view these labs.</li>
					</ul>
					<p>
						Something isn't right?{" "}
						<Link to={"/feedback"} className="text-sky-500 underline">
							Let us know
						</Link>
						.
					</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout heading={pageHeading}>
			<SelectedDeployment sticky={false} />
			<FilterTextBox
				value={filterTerm}
				onChange={(value: string) => handleSearchChange(value)}
				placeHolderText={`Filter ${pageHeading.toLowerCase()}`}
			/>
			<LabGridLayout>
				{filteredLabs
					?.sort((a, b) => a.name.localeCompare(b.name))
					.map((lab) => (
						<LabCard lab={lab} key={lab.id} />
					))}
			</LabGridLayout>
			<Terminal />
		</PageLayout>
	);
}

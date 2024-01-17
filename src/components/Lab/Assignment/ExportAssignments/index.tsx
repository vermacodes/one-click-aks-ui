import { FaFileExport } from "react-icons/fa";
import { Assignment } from "../../../../dataStructures";
import { useGetMyProfile } from "../../../../hooks/useProfile";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
	assignments?: Assignment[];
};

export default function ExportAssignments({ assignments }: Props) {
	const { data: myProfile } = useGetMyProfile();

	if (!assignments || !myProfile || !myProfile.roles.includes("mentor")) {
		return null;
	}

	function exportToCSV() {
		if (!assignments) {
			return;
		}

		// Exclude assignments where status is 'Deleted'
		const filteredAssignments = assignments.filter((assignment) => assignment.status !== "Deleted");

		// Create CSV headers
		const headers = Object.keys(filteredAssignments[0]).join(",");

		// Create CSV content
		const csv = [headers].concat(filteredAssignments.map((row) => Object.values(row).join(","))).join("\n");

		// Create a Blob with the CSV data
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

		// Create a link element
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "assignments.csv";

		// Append the link to the body and simulate a click to download the file
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return (
		<Button variant="secondary-outline" onClick={exportToCSV}>
			<FaFileExport /> Export
		</Button>
	);
}

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function BackButton() {
	const navigate = useNavigate();
	return (
		<div className="mb-4 flex items-center text-lg">
			<Button variant="text" onClick={() => navigate(-1)}>
				<MdArrowBack /> Back
			</Button>
		</div>
	);
}

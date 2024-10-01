import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ButtonVariant, Lab } from "../../../../dataStructures";
import { useLab } from "../../../../hooks/useLab";
import Button from "../../../UserInterfaceComponents/Button";
import SaveLabModal from "../SaveLabModal";

type Props = {
	variant?: ButtonVariant;
	disabled?: boolean;
	children?: React.ReactNode;
	lab?: Lab;
};

export default function SaveLabButton({ variant, disabled, children, lab }: Props) {
	const navigate = useNavigate();
	const { data: _lab } = useLab();
	const [showModal, setShowModal] = useState<boolean>(false);

	if (_lab === undefined || _lab.template === undefined) {
		return null;
	}

	return (
		<>
			<Button variant={variant ? variant : "secondary-text"} onClick={() => navigate("/lab/save")} disabled={disabled}>
				{children ? (
					children
				) : (
					<>
						<FaSave /> Save
					</>
				)}
			</Button>

			{showModal && <SaveLabModal lab={lab ? lab : _lab} showModal={showModal} setShowModal={setShowModal} />}
		</>
	);
}

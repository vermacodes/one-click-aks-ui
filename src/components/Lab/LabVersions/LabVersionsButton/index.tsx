import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ButtonVariant, Lab } from "../../../../dataStructures";
import Button from "../../../UserInterfaceComponents/Button";

type Props = {
  variant?: ButtonVariant;
  lab: Lab;
};

export default function LabVersionsButton({
  variant = "secondary-text",
  lab,
}: Props) {
  const navigate = useNavigate();
  return (
    <Button
      variant="secondary-text"
      onClick={() => navigate(`/lab/versions/${lab.type}/${lab.id}`)}
    >
      <FaHistory /> Versions
    </Button>
  );
}

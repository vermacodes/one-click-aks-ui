import { SiTerraform } from "react-icons/si";
import InitButton from "../../Terraform/ActionButtons/InitButton";
import Container from "../../UserInterfaceComponents/Container";

type Props = {};

export default function TerraformInit({}: Props) {
	return (
		<Container title="Initialize Terraform" collapsible={true}>
			<div className="flex items-center justify-end py-2">
				<InitButton variant="secondary-text" ariaLabel="Terraform Init">
					<SiTerraform aria-label="Terraform Icon" /> Terraform Init
				</InitButton>
			</div>
			<div className="flex flex-col">
				<p className="text-xs text-slate-700 dark:text-slate-300">
					Terraform is auto initialized after login. But if you see issues, use this to initialize again.
				</p>
				<p className="text-xs text-slate-700 dark:text-slate-300"></p>
			</div>
		</Container>
	);
}

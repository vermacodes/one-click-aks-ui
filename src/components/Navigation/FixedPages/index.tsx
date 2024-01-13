import { FaCog, FaComments } from "react-icons/fa";
import LoginButton from "../../Authentication/LoginButton";
import NavItem from "../NavItem";

export default function FixedPages() {
	return (
		<div className="h-fit w-full flex-col p-4">
			<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 text-sm lg:text-xl">
				<NavItem
					icon={<FaCog />}
					label="Settings"
					to={"/settings"}
					toolTipMessage="Manage actlabs configurations and Your server."
				/>
				<NavItem
					icon={<FaComments />}
					label="Help & Feedback"
					to={"/feedback"}
					toolTipMessage="Need help or have feedback? Please fill out the form and we will get back to you."
				/>
				<li>
					<LoginButton />
				</li>
			</ul>
		</div>
	);
}

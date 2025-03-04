import { BsArrowUpRight } from "react-icons/bs";
import { FaCog, FaComments } from "react-icons/fa";
import { useSelectedDeployment } from "../../../hooks/useSelectedDeployment";
import LoginButton from "../../Authentication/LoginButton";
import NavItem from "../NavItem";

export default function FixedPages() {
	const { selectedDeployment } = useSelectedDeployment();

	return (
		<div className="h-fit w-full flex-col p-4">
			<ul className="md:text-l flex w-full flex-col justify-start gap-y-1 text-sm lg:text-xl">
				{/* {selectedDeployment && (
					<NavItem
						to="/deployments"
						label="Deployments"
						toolTipMessage="Selected Deployment's status. Click to see all deployments."
					>
						<DeploymentStatus deployment={selectedDeployment} />
					</NavItem>
				)} */}
				<NavItem
					icon={<FaCog />}
					label="Settings"
					to={"/settings"}
					toolTipMessage="Manage actlabs configurations and Your server."
				/>
				{/* <NavItem
					icon={<FaComments />}
					label="Help & Feedback"
					to={"/feedback"}
					toolTipMessage="Need help or have feedback? Please fill out the form and we will get back to you."
				/> */}
				<li>
					<a
						target="_blank"
						href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyB_Mn8cPhhPoGtsF2A-X8pUQ1FUNTMwVDdTNUFEMllYWFUwSllYWFMyVy4u"
					>
						<button className="flex h-full w-full items-center justify-start gap-2 rounded px-4 py-3 text-left text-base hover:bg-slate-200 dark:hover:bg-slate-800">
							<span>
								<FaComments />
							</span>
							<span>Help & Feedback</span>
							<span>
								<BsArrowUpRight />
							</span>
						</button>
					</a>
				</li>
				<li>
					<LoginButton />
				</li>
			</ul>
		</div>
	);
}

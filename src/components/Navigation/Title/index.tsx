import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import Button from "../../UserInterfaceComponents/Button";

export default function Title() {
	const { navbarOpen, setNavbarOpen } = useGlobalStateContext();
	let env = "Prod";
	// if the URL is localhost, set env to local
	if (window.location.href.includes("localhost")) {
		env = "Local Environment";
	} else if (window.location.href.includes("dev")) {
		env = "Development Environment";
	}
	return (
		<div
			className={`flex items-center justify-between bg-slate-200 dark:bg-slate-800`}
			role="banner"
			aria-label="Header"
		>
			<Link to={"/"} className="flex flex-col items-center px-4">
				<h1 className="flex flex-row items-center">
					<img
						src="/actlabs_logo_rocket.svg"
						className="mr-2 h-8 w-8"
						alt="ACTLabs logo showing a rocket flying away from the moon."
					></img>
					<span className="text-4xl font-bold hover:text-sky-500">ACT Labs</span>
				</h1>
				{env != "Prod" && (
					<span className="w-full rounded-sm bg-sky-400 px-1 text-center text-xs font-semibold dark:bg-sky-700 ">
						{env}
					</span>
				)}
			</Link>
			{navbarOpen && (
				<Button className="mr-2 rounded-full p-4 text-xl hover:outline" onClick={() => setNavbarOpen(false)}>
					<FaAngleLeft />
				</Button>
			)}
		</div>
	);
}

import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import Button from "../../../components/UserInterfaceComponents/Button";

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
			className={`flex items-center justify-between gap-4 bg-slate-200 dark:bg-slate-800`}
			role="banner"
			aria-label="Header"
		>
			<Button
				className="rounded-full p-3 text-base outline-1 hover:outline md:text-xl"
				onClick={() => setNavbarOpen(!navbarOpen)}
			>
				<FaBars />
			</Button>
			<Link to={"/"} className="flex items-center gap-2 pr-4 md:flex-col md:gap-0">
				<h1 className="flex flex-row items-center">
					<img
						src="/actlabs_logo_rocket.svg"
						className="mr-2 h-2 w-2 sm:h-4 sm:w-4 lg:h-6 lg:w-6"
						alt="ACTLabs logo showing a rocket flying away from the moon."
					></img>
					<span className="text-sm font-bold hover:text-sky-500 sm:text-base lg:text-2xl">ACT Labs</span>
				</h1>
				{env != "Prod" && (
					<span className="rounded-sm bg-sky-400 px-1 text-center text-[8px] font-semibold dark:bg-sky-700 sm:text-xs md:w-full ">
						{env}
					</span>
				)}
			</Link>
		</div>
	);
}

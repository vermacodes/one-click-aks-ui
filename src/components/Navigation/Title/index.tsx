import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import Button from "../../UserInterfaceComponents/Button";

export default function Title() {
	const { setNavbarOpen } = useGlobalStateContext();
	let env = "Prod";
	// if the URL is localhost, set env to local
	if (window.location.href.includes("localhost")) {
		env = "Local";
	} else if (window.location.href.includes("dev")) {
		env = "Dev";
	}
	return (
		<div className={`flex items-center justify-between pb-2 pt-6 transition duration-1000`}>
			<Link to={"/"}>
				<h1 className="flex flex-row items-center pl-8">
					<img
						src="/actlabs_logo_rocket.svg"
						className="mr-2 h-8 w-8"
						alt="ACTLabs logo showing a rocket flying away from the moon."
					></img>
					<span className="text-2xl font-bold hover:text-sky-500">ACT Labs</span>
					{env != "Prod" && <span className="ml-2 rounded-sm bg-sky-500 px-1 text-sm font-semibold">{env}</span>}
				</h1>
			</Link>
			<Button className="md pr-4 text-2xl md:invisible" onClick={() => setNavbarOpen(false)}>
				<FaTimes />
			</Button>
		</div>
	);
}

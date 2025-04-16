import { useEffect, useRef } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { useGlobalStateContext } from "../../components/Context/GlobalStateContext";
import Detectors from "../../components/Detectors/Detectors";
import ResetLabState from "../../components/Lab/ResetLabState";
import Button from "../../components/UserInterfaceComponents/Button";
import DarkModeSwitch from "../../components/UserInterfaceComponents/DarkModeSwitch";

type Props = {
	heading?: string;
	children: React.ReactNode;
};

export default function PageLayout({ heading, children }: Props) {
	const { darkMode, setDarkMode, navbarOpen, setNavbarOpen } = useGlobalStateContext();
	const outerDivRef = useRef<null | HTMLDivElement>(null);
	const pageHeading = useRef<null | HTMLHeadingElement>(null);

	useEffect(() => {
		if (outerDivRef.current !== null) {
			outerDivRef.current.scrollIntoView();
		}
		if (pageHeading.current !== null) {
			pageHeading.current.focus(); // Focus the page heading
		}
	}, [heading]);

	return (
		<div ref={outerDivRef}>
			<Detectors />
			{heading !== undefined && (
				<div
					className={`${
						heading !== "" ? "mb-4 border-b-2 border-slate-500 " : "mt-6 "
					} flex items-center justify-between text-wrap`}
				>
					<div className="flex items-center">
						{!navbarOpen && (
							<Button className="mr-2 rounded-full p-4 text-xl hover:outline" onClick={() => setNavbarOpen(true)}>
								<FaBars />
							</Button>
						)}
						<h2 className="py-4 text-xl md:text-4xl" tabIndex={-1} ref={pageHeading}>
							{heading}
						</h2>
					</div>
					<div className="flex gap-4">
						{/* <a href="https://teams.microsoft.com/l/chat/0/0?users=ashisverma@microsoft.com" target="_blank">
							<Button variant="danger-icon" tooltipMessage="Found Bug? Report it Now!">
								<FaBug />
							</Button>
						</a> */}
						<ResetLabState buttonVariant="text" newLab={true}>
							<FaPlus /> New Lab
						</ResetLabState>
						<DarkModeSwitch
							handleOnChange={() => setDarkMode(!darkMode)}
							label=""
							id="darkModeSwitch"
							checked={darkMode}
						/>
					</div>
				</div>
			)}
			{children}
		</div>
	);
}

import { FaPlus } from "react-icons/fa";
import LoginButton from "../../../components/Authentication/LoginButton";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import ResetLabState from "../../../components/Lab/ResetLabState";
import DarkModeSwitch from "../../../components/UserInterfaceComponents/DarkModeSwitch";
import Title from "../Title";

export default function HeaderLayout() {
	const { darkMode, setDarkMode, navbarOpen, setNavbarOpen } = useGlobalStateContext();
	return (
		<div className="flex h-[10%] w-full items-center justify-between bg-slate-200 pl-2 dark:bg-slate-800">
			<Title />
			<div className="flex gap-4 pr-4">
				{/* <a href="https://teams.microsoft.com/l/chat/0/0?users=ashisverma@microsoft.com" target="_blank">
							<Button variant="danger-icon" tooltipMessage="Found Bug? Report it Now!">
								<FaBug />
							</Button>
						</a> */}
				<ResetLabState buttonVariant="text" newLab={true}>
					<FaPlus /> New Lab
				</ResetLabState>
				<DarkModeSwitch handleOnChange={() => setDarkMode(!darkMode)} label="" id="darkModeSwitch" checked={darkMode} />
				<LoginButton showName={false} />
			</div>
		</div>
	);
}

import { FaPlus } from "react-icons/fa";
import LoginButton from "../../../components/Authentication/LoginButton";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import ResetLabState from "../../../components/Lab/ResetLabState";
import ThemeSwitchRadioGroup from "../../../components/UserInterfaceComponents/ThemeSwitchRadioGroup";
import Title from "../Title";

export default function HeaderLayout() {
  const { darkMode, setDarkMode, viewportWidth } = useGlobalStateContext();
  return (
    <div className="flex h-[20%] w-full items-center justify-between pl-2 sm:h-[10%]">
      <Title />
      <div className="flex items-center gap-2 pr-4">
        {/* <a href="https://teams.microsoft.com/l/chat/0/0?users=ashisverma@microsoft.com" target="_blank">
							<Button variant="danger-icon" tooltipMessage="Found Bug? Report it Now!">
								<FaBug />
							</Button>
						</a> */}
        <ResetLabState newLab={true} aria-label="Create New Lab">
          <FaPlus /> New Lab
        </ResetLabState>
        {/* Theme switch is hidden from teh view, but mounted for the automatic theme switch.*/}
        <ThemeSwitchRadioGroup className="hidden" />
        {viewportWidth >= 512 && (
          <>
            <LoginButton showName={false} />
          </>
        )}
      </div>
    </div>
  );
}

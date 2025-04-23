import { FaPlus } from "react-icons/fa";
import LoginButton from "../../../components/Authentication/LoginButton";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import ResetLabState from "../../../components/Lab/ResetLabState";
import DarkModeSwitch from "../../../components/UserInterfaceComponents/DarkModeSwitch";
import Title from "../Title";

export default function HeaderLayout() {
  const { darkMode, setDarkMode, viewportWidth } = useGlobalStateContext();
  return (
    <div className="flex h-[10%] w-full items-center justify-between pl-2">
      <Title />
      <div className="flex items-center gap-4 pr-4">
        {/* <a href="https://teams.microsoft.com/l/chat/0/0?users=ashisverma@microsoft.com" target="_blank">
							<Button variant="danger-icon" tooltipMessage="Found Bug? Report it Now!">
								<FaBug />
							</Button>
						</a> */}
        <ResetLabState newLab={true}>
          <FaPlus /> New Lab
        </ResetLabState>
        {viewportWidth >= 512 && (
          <>
            <DarkModeSwitch
              handleOnChange={() => setDarkMode(!darkMode)}
              label=""
              id="darkModeSwitch"
              checked={darkMode}
            />
            <LoginButton showName={false} />
          </>
        )}
      </div>
    </div>
  );
}

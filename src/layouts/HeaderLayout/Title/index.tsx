import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../../components/Context/GlobalStateContext";
import Button from "../../../components/UserInterfaceComponents/Button";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";

export default function Title() {
  const { navbarOpen, setNavbarOpen, viewportWidth } = useGlobalStateContext();
  let env = "Prod";
  // if the URL is localhost, set env to local
  if (window.location.href.includes("localhost")) {
    env = "Local Environment";
  } else if (window.location.href.includes("dev")) {
    env = "Development Environment";
  }
  return (
    <div
      className={`flex items-center justify-between gap-4`}
      role="banner"
      aria-label="Header"
    >
      <Button
        className="rounded-full p-1 text-sm hover:outline-1 md:p-3 md:text-xl"
        onClick={() => setNavbarOpen(!navbarOpen)}
        aria-label="Toggle Navigation"
      >
        <FaBars />
      </Button>
      <Link to={"/"} className="flex flex-col items-center gap-2 pr-4 md:gap-0">
        <h1 className="flex flex-row items-center">
          <img
            src="/actlabs_logo_rocket.svg"
            className="mr-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6"
            alt="ACTLabs logo showing a rocket flying away from the moon."
          ></img>
          <span className="text-sm font-semibold text-nowrap lg:text-xl xl:text-2xl">
            ACT Labs
          </span>
        </h1>
        {env != "Prod" && viewportWidth >= 768 && (
          <span
            className={cn(
              "rounded-xs px-1 text-center text-[8px] font-semibold md:w-full lg:text-xs",
              getUIStateColors({ selected: true }),
            )}
          >
            {env}
          </span>
        )}
      </Link>
    </div>
  );
}

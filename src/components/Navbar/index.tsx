import { useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode, MdOutlineSettings } from "react-icons/md";
import { VscServerEnvironment } from "react-icons/vsc";
import Settings from "../../modals/Settings";
import { Link } from "react-router-dom";
import { useServerStatus } from "../../hooks/useServerStatus";

type NavbarProps = {
    darkMode: boolean;
    setDarkMode(args: boolean): void;
};

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const { data: serverStatus, refetch: getServerStatus } = useServerStatus();
    return (
        <nav className="flex justify-between py-4 px-20 mb-2 border-b dark:border-b-slate-700">
            <Link to={"/"}>
                <h1 className="text-2xl font-bold border-b-2 border-transparent hover:border-b-sky-400 hover:text-sky-400">
                    ACT Labs
                </h1>
            </Link>
            <div className="flex divide-x divide-gray-300 dark:divide-slate-700  align-middle">
                <ul className="flex space-x-3 px-5 align-middle">
                    <li>
                        <Link to={"/builder"}>
                            <button className="py-1 border-b-2 border-transparent hover:border-b-sky-400 hover:border-b-2 hover:text-sky-400 ">
                                Builder
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/templates"}>
                            <button className="py-1 border-b-2 border-transparent hover:border-b-sky-400 hover:border-b-2 hover:text-sky-400">
                                Templates
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/learning"}>
                            <button className="py-1 border-b-2 border-transparent hover:border-b-sky-400 hover:border-b-2 hover:text-sky-400">
                                Learning
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/mockcases"}>
                            <button className="py-1 border-b-2 border-transparent hover:border-b-sky-400 hover:border-b-2 hover:text-sky-400">
                                Mock Cases
                            </button>
                        </Link>
                    </li>
                </ul>
                <ul className="flex space-x-3 pl-5">
                    <li>
                        <button
                            className={`py-1 border-b-2 border-transparent hover:border-b-sky-400 text-2xl items-center justify-center hover:text-sky-400 ${
                                serverStatus ? "text-green-500" : "text-red-500"
                            }`}
                            onClick={() => getServerStatus}
                        >
                            <VscServerEnvironment />
                        </button>
                    </li>
                    <li>
                        <button
                            className="py-1 border-b-2 border-transparent hover:border-b-sky-400 text-2xl items-center justify-center hover:text-sky-400"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                        </button>
                    </li>
                    <li>
                        <button
                            className="py-1 border-b-2 border-transparent hover:border-b-sky-400 text-2xl items-center justify-center hover:text-sky-400"
                            onClick={() => setShowSettingsModal(!showSettingsModal)}
                        >
                            <MdOutlineSettings />
                        </button>
                    </li>
                    <li>
                        <button className="bg-sky-500 py-1 px-5 rounded-2xl text-bold text-white hover:bg-sky-700">
                            Login
                        </button>
                    </li>
                </ul>
            </div>
            <Settings showModal={showSettingsModal} setShowModal={setShowSettingsModal} />
        </nav>
    );
}

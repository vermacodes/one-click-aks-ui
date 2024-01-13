import { useState } from "react";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import FixedPages from "../FixedPages";
import Pages from "../Pages";
import Title from "../Title";

export default function Navbar() {
	const { navbarOpen, setNavbarOpen } = useGlobalStateContext();
	const [isScrolled, setIsScrolled] = useState(false);
	return (
		<nav className="flex h-screen w-full min-w-max flex-col  text-slate-900 dark:text-slate-100">
			<Title navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} isScrolled={isScrolled} />
			<Pages setIsScrolled={setIsScrolled} />
			<FixedPages />
		</nav>
	);
}

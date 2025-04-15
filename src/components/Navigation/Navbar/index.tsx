import FixedPages from "../FixedPages";
import Pages from "../Pages";
import Title from "../Title";

export default function Navbar() {
	return (
		<nav className="flex h-screen w-full min-w-max flex-col text-slate-900 dark:text-slate-100">
			<Title />
			<Pages />
			<FixedPages />
		</nav>
	);
}

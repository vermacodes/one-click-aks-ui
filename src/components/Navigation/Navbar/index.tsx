import Pages from "../Pages";

export default function Navbar() {
	return (
		<nav
			className="flex h-[80%] w-full min-w-max flex-col text-slate-900 dark:text-slate-100"
			id="navbar"
			role="navigation"
			aria-label="Main navigation"
		>
			<Pages />
			{/* <FixedPages /> */}
		</nav>
	);
}

import Container from "../../../components/UserInterfaceComponents/Container";
import { defaultScrollbarOnContainerStyle } from "../../../defaults";
import Pages from "../Pages";

export default function Navbar() {
	return (
		<Container
			additionalClasses={`m-4 overflow-y-auto min-w-fit mt-[1px] flex w-screen flex-col rounded-md bg-slate-100 text-slate-900 shadow-md dark:bg-slate-900 dark:text-slate-100 w-1/5 ${defaultScrollbarOnContainerStyle}`}
			id="navbar"
			role="navigation"
			aria-label="Main navigation"
		>
			<Pages />
			{/* <FixedPages /> */}
		</Container>
	);
}

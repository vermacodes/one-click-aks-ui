import Container from "../../../components/UserInterfaceComponents/Container";
import { defaultScrollbarOnContainerStyle } from "../../../defaults";
import Pages from "../Pages";

export default function Navbar() {
  return (
    <Container
      additionalClasses={`ml-4 mt-4 mb-4 md:mr-[1px] mr-4 overflow-y-auto min-w-fit mt-[1px] flex w-screen flex-col rounded-md shadow-md md:w-1/5 ${defaultScrollbarOnContainerStyle}`}
      id="navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      <Pages />
      {/* <FixedPages /> */}
    </Container>
  );
}

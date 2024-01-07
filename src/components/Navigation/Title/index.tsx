import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../../UserInterfaceComponents/Button";

type Props = {
  navbarOpen: boolean;
  setNavbarOpen: (open: boolean) => void;
};

export default function Title({ navbarOpen, setNavbarOpen }: Props) {
  return (
    <div className="flex items-center justify-between pt-6 pb-2">
      <Link to={"/"}>
        <h1 className="flex flex-row items-center pl-8 text-2xl font-bold hover:text-sky-500">
          <img src="/actlabs_logo_rocket.svg" className="mr-2 h-8 w-8"></img>
          ACT Labs
        </h1>
      </Link>
      <Button className="md pr-4 text-2xl md:invisible" onClick={() => setNavbarOpen(false)}>
        <FaTimes />
      </Button>
    </div>
  );
}

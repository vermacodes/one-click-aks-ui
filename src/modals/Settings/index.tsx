import { MdClose } from "react-icons/md";
type SettingsProps = {
    showModal: boolean;
    setShowModal(args: boolean): void;
};

export default function Settings({ showModal, setShowModal }: SettingsProps) {
    if (!showModal) return null;
    return (
        <div
            className="fixed inset-0 max-h-full max-w-ful bg-slate-900 bg-opacity-80 dark:bg-slate-100 dark:bg-opacity-80 flex justify-center"
            onClick={() => setShowModal(false)}
        >
            <div
                className=" w-3/4 p-5 rounded bg-slate-100 dark:bg-slate-900 my-20 space-y-2 divide-y divide-gray-300 dark:divide-slate-700"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="flex w-100 justify-between pb-2">
                    <h1 className="text-3xl">Settings</h1>
                    <button onClick={() => setShowModal(false)}>
                        <MdClose className="text-3xl" />
                    </button>
                </div>

                <div className="flex justify-between items-center w-100 py-2 space-x-reverse space-x-2">
                    <h2 className="text-lg">Subscription</h2>
                    <button className="bg-sky-500 py-1 px-5 rounded-2xl text-bold text-white hover:bg-sky-700">
                        Select
                    </button>
                </div>
                <div className="flex justify-between items-center w-100 py-2 space-x-reverse space-x-2">
                    <h2 className="text-lg">Storage Account</h2>
                    <button className="bg-sky-500 py-1 px-5 rounded-2xl text-bold text-white hover:bg-sky-700">
                        Configure
                    </button>
                </div>
            </div>
        </div>
    );
}

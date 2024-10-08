import { isAxiosError } from "axios";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { Lab } from "../../../../dataStructures";
import { defaultScrollbarStyle } from "../../../../defaults";
import { useCreateLab, useCreateLabWithSupportingDocument, useCreateMyLab } from "../../../../hooks/useBlobs";
import { labDescriptionSchema, labNameSchema } from "../../../../zodSchemas";
import { useGlobalStateContext } from "../../../Context/GlobalStateContext";
import Button from "../../../UserInterfaceComponents/Button";
import ConfirmationModal from "../../../UserInterfaceComponents/Modal/ConfirmationModal";
import SaveLabDescription from "../SaveLabDescription";
import SaveLabMessage from "../SaveLabMessage";
import SaveLabName from "../SaveLabName";
import SaveLabSupportingDocument from "../SaveLabSupportingDocument";
import SaveLabTags from "../SaveLabTags";
import SaveLabType from "../SaveLabType";

type Props = {
	lab: Lab;
	showModal: boolean;
	setShowModal(args: boolean): void;
};

export default function SaveLabModal({ lab, showModal, setShowModal }: Props) {
	const [labState, setLabState] = useState<Lab>({ ...lab });
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [supportingDocument, setSupportingDocument] = useState<File | null>(null);

	const { setLab } = useGlobalStateContext();
	const { mutateAsync: createMyLab } = useCreateMyLab();
	const { mutateAsync: createLab } = useCreateLab();
	const { mutateAsync: createLabWithSupportingDocument } = useCreateLabWithSupportingDocument();

	function handleCreateMyLab() {
		const response = toast.promise(createMyLab(labState), {
			pending: "Saving lab...",
			success: "Lab saved.",
			error: {
				render(data: any) {
					return `Lab creation failed: ${data.data.response.data.error}`;
				},
				autoClose: false,
			},
		});

		response.then(() => {
			setLab(labState);
			handleModalClose();
		});
	}

	function handleCreateLab() {
		if (lab.id !== "") {
			setShowConfirmationModal(true);
		} else {
			onConfirmCreateLab();
		}
	}

	function onConfirmCreateLab() {
		setShowConfirmationModal(false);
		const createLabPromise = supportingDocument
			? createLabWithSupportingDocument([labState, supportingDocument])
			: createLab(labState);

		const response = toast.promise(createLabPromise, {
			pending: "Saving lab...",
			success: "Lab saved.",
			error: {
				render(data: any) {
					return `Lab creation failed: ${data.data.response.data.error}`;
				},
				autoClose: false,
			},
		});

		response.then((response) => {
			// if the response is an axios error, then return
			// as the toast.promise will handle the error
			if (isAxiosError(response)) {
				return;
			}

			// remove extension script of lab in memory from session storage
			// its of no use to keep that in session storage
			// as the lab is saved and the extension script is saved in the lab
			sessionStorage.removeItem(`${lab.id}-extendScript"`);

			// update lab in memory.
			setLab(response.data);

			// close the modal after lab is saved.
			handleModalClose();
		});
	}

	// handles the closing of save lab modal.
	function handleModalClose() {
		setShowModal(false);
	}

	if (!showModal) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-20 flex max-h-full max-w-full justify-center bg-slate-800 bg-opacity-80 dark:bg-slate-100 dark:bg-opacity-80"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<div
				className={`${defaultScrollbarStyle} my-10 h-[90%] w-2/3 space-y-4 overflow-y-auto overflow-x-hidden rounded bg-slate-100 p-5 dark:divide-slate-700 dark:bg-slate-900 `}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className="w-100 mb-5 flex justify-between border-b-2 border-b-slate-500 pb-2">
					<h1 className="text-3xl">Save Lab</h1>
					<button onClick={() => handleModalClose()} className="hover:text-sky-500">
						<MdClose className="text-3xl" />
					</button>
				</div>
				<SaveLabName lab={labState} setLab={setLabState} />
				<SaveLabTags lab={labState} setLab={setLabState} />
				<SaveLabType lab={labState} setLab={setLabState} />

				<SaveLabDescription lab={labState} setLab={setLabState} />
				{(labState.type === "challengelab" || labState.type === "readinesslab") && (
					<SaveLabMessage lab={labState} setLab={setLabState} />
				)}
				{labState.type === "mockcase" && (
					<SaveLabSupportingDocument
						lab={labState}
						setLab={setLabState}
						supportingDocument={supportingDocument}
						setSupportingDocument={setSupportingDocument}
					/>
				)}
				<div className="flex items-end justify-end gap-x-4">
					<Button
						variant="primary"
						tooltipMessage="Updates the lab in place."
						tooltipDelay={1000}
						tooltipDirection="top"
						disabled={
							!labNameSchema.safeParse(labState.name).success ||
							!labDescriptionSchema.safeParse(labState.description).success
							//  ||
							// lab.type !== labState.type
						}
						onClick={() => {
							labState.type === "template" ? handleCreateMyLab() : handleCreateLab();
						}}
					>
						{lab.id === "" ? "Save" : "Update"}
					</Button>
					{lab.id !== "" && (
						<Button
							variant="primary"
							tooltipMessage="Saves as new copy of lab."
							tooltipDelay={1000}
							tooltipDirection="top"
							disabled={
								!labNameSchema.safeParse(labState.name).success ||
								!labDescriptionSchema.safeParse(labState.description).success
							}
							onClick={() => {
								setLabState({
									...labState,
									id: "",
									createdBy: "",
									updatedBy: "",
									owners: [],
									editors: [],
									viewers: [],
									createdOn: "",
								}); // Clear the ID so it creates a new lab
								labState.type === "template" ? handleCreateMyLab() : handleCreateLab();
							}}
						>
							Save as New
						</Button>
					)}
					<Button
						variant="secondary"
						tooltipMessage="Cancel Changes"
						tooltipDelay={1000}
						tooltipDirection="top"
						onClick={handleModalClose}
					>
						Cancel
					</Button>
				</div>
			</div>
			{showConfirmationModal && (
				<ConfirmationModal
					title="Confirm Update"
					onClose={() => setShowConfirmationModal(false)}
					onConfirm={onConfirmCreateLab}
				>
					<p className="text-xl">Are you sure? This will create a new version.</p>
				</ConfirmationModal>
			)}
		</div>
	);
}

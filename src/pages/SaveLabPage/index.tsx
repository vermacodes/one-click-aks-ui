import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalStateContext } from "../../components/Context/GlobalStateContext";
import SaveLabDescription from "../../components/Lab/SaveLab/SaveLabDescription";
import SaveLabMessage from "../../components/Lab/SaveLab/SaveLabMessage";
import SaveLabName from "../../components/Lab/SaveLab/SaveLabName";
import SaveLabRbacEnforcedProtectedLab from "../../components/Lab/SaveLab/SaveLabRbacEnforcedProtectedLab";
import SaveLabSupportingDocument from "../../components/Lab/SaveLab/SaveLabSupportingDocument";
import SaveLabTags from "../../components/Lab/SaveLab/SaveLabTags";
import SaveLabType from "../../components/Lab/SaveLab/SaveLabType";
import Button from "../../components/UserInterfaceComponents/Button";
import ConfirmationModal from "../../components/UserInterfaceComponents/Modal/ConfirmationModal";
import { Lab } from "../../dataStructures";
import { defaultScrollbarStyle, getDefaultLab } from "../../defaults";
import {
	useCreateLab,
	useCreateLabWithSupportingDocument,
	useCreateMyLab,
	useUpsertSupportingDocument,
} from "../../hooks/useBlobs";
import { useLab } from "../../hooks/useLab";
import PageLayout from "../../layouts/PageLayout";
import { labDescriptionSchema, labNameSchema } from "../../zodSchemas";

export default function SaveLabPage() {
	const [labState, setLabState] = useState<Lab>({ ...getDefaultLab() });
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [supportingDocument, setSupportingDocument] = useState<File | null>(null);

	const navigate = useNavigate();

	const { data: lab } = useLab();
	const { setLab } = useGlobalStateContext();
	const { mutateAsync: createMyLab } = useCreateMyLab();
	const { mutateAsync: createLab } = useCreateLab();
	const { mutateAsync: upsertSupportingDocument } = useUpsertSupportingDocument();
	const { mutateAsync: createLabWithSupportingDocument } = useCreateLabWithSupportingDocument();

	// Use useEffect to update labState when lab data is available
	useEffect(() => {
		if (lab) {
			setLabState(lab);

			// If lab id is not empty, then update the page title with the lab name
			if (lab.id !== "") {
				document.title = `ACT Labs | Save Lab | ${lab.name}`;
			}
		}
	}, [lab]);

	if (!lab) {
		return (
			<PageLayout heading="Save Lab">
				<p>Nothing to save</p>
			</PageLayout>
		);
	}

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

		response
			.then(() => {
				setLab(labState);
			})
			.finally(() => {
				returnToBuilder();
			});
	}

	function handleCreateLab() {
		if (lab && lab.id !== "") {
			setShowConfirmationModal(true);
		} else {
			onConfirmCreateLab();
		}
	}

	// function onConfirmCreateLab() {
	// 	setShowConfirmationModal(false);
	// 	const createLabPromise = supportingDocument
	// 		? createLabWithSupportingDocument([labState, supportingDocument])
	// 		: createLab(labState);

	// 	const response = toast.promise(createLabPromise, {
	// 		pending: "Saving lab...",
	// 		success: "Lab saved.",
	// 		error: {
	// 			render(data: any) {
	// 				return `Lab creation failed: ${data.data.response.data.error}`;
	// 			},
	// 			autoClose: false,
	// 		},
	// 	});

	// 	response
	// 		.then((response) => {
	// 			// if the response is an axios error, then return
	// 			// as the toast.promise will handle the error
	// 			if (isAxiosError(response)) {
	// 				return;
	// 			}

	// 			// remove extension script of lab in memory from session storage
	// 			// its of no use to keep that in session storage
	// 			// as the lab is saved and the extension script is saved in the lab
	// 			lab && sessionStorage.removeItem(`${lab.id}-extendScript"`);

	// 			// update lab in memory.
	// 			setLab(response.data);
	// 		})
	// 		.finally(() => {
	// 			returnToBuilder();
	// 		});
	// }

	async function onConfirmCreateLab() {
		setShowConfirmationModal(false);

		try {
			let documentId = null;

			if (supportingDocument) {
				// Run upsertSupportingDocument and get the documentId from the response header
				const upsertResponse = await toast.promise(upsertSupportingDocument(supportingDocument), {
					pending: "Uploading supporting document...",
					success: "Supporting document uploaded.",
					error: "Failed to upload supporting document.",
				});
				console.log("upsertResponse", upsertResponse);
				documentId = upsertResponse.supportingDocumentId;
				console.log("documentId", documentId);

				// Update the labState with the supportingDocumentId
				labState.supportingDocumentId = documentId;
			}

			// Create the lab using the createLab method
			const createLabPromise = createLab(labState);

			const response = await toast.promise(createLabPromise, {
				pending: "Saving lab...",
				success: "Lab saved.",
				error: {
					render(data: any) {
						return `Lab creation failed: ${data.data.response.data.error}`;
					},
					autoClose: false,
				},
			});

			// if the response is an axios error, then return
			// as the toast.promise will handle the error
			if (isAxiosError(response)) {
				return;
			}

			// remove extension script of lab in memory from session storage
			// its of no use to keep that in session storage
			// as the lab is saved and the extension script is saved in the lab
			lab && sessionStorage.removeItem(`${lab.id}-extendScript`);

			// update lab in memory.
			setLab(response.data);

			returnToBuilder();
		} catch (error) {
			toast.error(`Failed to save supporting document`);
		}
	}

	// function handleModalClose(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
	// 	throw new Error("Function not implemented.");
	// }

	function returnToBuilder() {
		navigate("/builder");
	}

	return (
		<PageLayout heading={`${lab.id === "" ? "Save New Lab" : "Save Lab - " + lab.name}`}>
			<div
				className={`${defaultScrollbarStyle} mb-4 space-y-4 overflow-y-auto overflow-x-hidden rounded bg-slate-100 p-5 dark:divide-slate-700 dark:bg-slate-900 `}
			>
				{/* <div className="w-100 mb-5 flex justify-between border-b-2 border-b-slate-500 pb-2">
				<h1 className="text-3xl">Save Lab</h1>
				<button onClick={() => handleModalClose()} className="hover:text-sky-500">
					<MdClose className="text-3xl" />
				</button>
			</div> */}
				<SaveLabName lab={labState} setLab={setLabState} />
				<SaveLabTags lab={labState} setLab={setLabState} />
				<SaveLabType lab={labState} setLab={setLabState} />
				<SaveLabRbacEnforcedProtectedLab lab={labState} setLab={setLabState} />

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
						onClick={returnToBuilder}
					>
						Cancel
					</Button>
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
		</PageLayout>
	);
}

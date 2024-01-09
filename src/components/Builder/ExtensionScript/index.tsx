import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { FaBook, FaCheck, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { useGlobalStateContext } from "../../Context/GlobalStateContext";
import ExtendButton from "../../Terraform/ActionButtons/ExtendButton";
import Button from "../../UserInterfaceComponents/Button";
import Container from "../../UserInterfaceComponents/Container";

export default function ExtensionScript() {
	const { lab, setLab } = useGlobalStateContext();
	const [_extendScript, setExtendScript] = useState<string>(sessionStorage.getItem(`${lab.id}-extendScript"`) || "");

	useEffect(() => {
		if (lab !== undefined) {
			const extendScriptFromSessionStorage = sessionStorage.getItem(`${lab.id}-extendScript"`) || "";
			if (extendScriptFromSessionStorage === "") {
				setExtendScript(lab.extendScript);
				sessionStorage.setItem(`${lab.id}-extendScript"`, lab.extendScript || "");
				return;
			}
			setExtendScript(extendScriptFromSessionStorage);
		}
	}, [lab]);

	function handleExtendScriptSave() {
		sessionStorage.removeItem(`${lab.id}-extendScript"`);
		setLab({ ...lab, extendScript: _extendScript });
	}

	function handleExtendScriptChange(value: string | undefined) {
		if (value === undefined) return;

		value = value.replace(/\r\n/g, "\n"); // Replace Windows line endings with Unix line endings

		sessionStorage.setItem(`${lab.id}-extendScript"`, btoa(value));
		setExtendScript(btoa(value));
	}

	function compareBase64Strings(a: string, b: string) {
		// Remove line breaks from the base64 strings
		a = a.replace(/\n/g, "");
		b = b.replace(/\n/g, "");

		return a === b;
	}

	if (lab === undefined) return null;

	return (
		<Container
			title="Extension Script"
			collapsed={compareBase64Strings(_extendScript, lab.extendScript)}
			collapsible={true}
			hoverEffect={false}
			additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
			additionalContainerBodyClasses="flex flex-col gap-4"
		>
			<div className="-mb-2 flex flex-wrap-reverse items-center justify-end gap-2">
				<ExtendButton variant="secondary-text" lab={lab} mode="extend-apply">
					<FaPlus /> Run in Extend Mode
				</ExtendButton>
				<ExtendButton variant="secondary-text" lab={lab} mode="extend-validate">
					<FaCheck /> Run in Validate Mode
				</ExtendButton>
				<ExtendButton variant="secondary-text" lab={lab} mode="extend-destroy">
					<FaTrash /> Run in Destroy Mode
				</ExtendButton>
				<a
					href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280600/Extension-Script"
					target="_blank"
					rel="noreferrer"
				>
					<Button variant="secondary-text" tooltipMessage="Learn more about extension script in our documents.">
						<FaBook /> Documents ↗
					</Button>
				</a>
			</div>
			{!compareBase64Strings(_extendScript, lab.extendScript) ? (
				<div className="sticky top-0 z-10 -mb-14 flex w-1/2 translate-x-1/2 items-center justify-center gap-4 rounded-b-lg bg-sky-500 bg-opacity-30 p-1 text-slate-100">
					Unsaved Changes
					<Button
						variant="danger-text"
						onClick={() => handleExtendScriptChange(atob(lab.extendScript))}
						disabled={compareBase64Strings(_extendScript, lab.extendScript)}
					>
						<FaTimes /> Discard
					</Button>
					<Button
						variant="primary-text"
						onClick={handleExtendScriptSave}
						disabled={compareBase64Strings(_extendScript, lab.extendScript)}
					>
						<FaCheck /> Save
					</Button>
				</div>
			) : null}
			{_extendScript && (
				<Editor
					height="80vh"
					width={`100%`}
					language={"shell"}
					value={atob(_extendScript)}
					theme="vs-dark"
					defaultValue="// some comment"
					onChange={(value) => handleExtendScriptChange(value)}
				/>
			)}
		</Container>
	);
}

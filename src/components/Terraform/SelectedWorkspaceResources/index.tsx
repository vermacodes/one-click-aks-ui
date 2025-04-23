import { useContext } from "react";
import { defaultScrollbarStyle } from "../../../defaults";
import { useGetResources, useTerraformWorkspace } from "../../../hooks/useWorkspace";
import { WebSocketContext } from "../../Context/WebSocketContext";

type Props = {};

export default function SelectedWorkspaceResources({}: Props) {
	const { actionStatus } = useContext(WebSocketContext);
	const { data: resources, isFetching: fetchingResources } = useGetResources();
	const { isFetching: fetchingWorkspaces, isLoading: gettingWorkspaces } = useTerraformWorkspace();

	return (
		<div className="w-full justify-between gap-y-4 rounded-sm border border-slate-500 py-2">
			<div className={`h-48 overflow-x-hidden rounded-sm px-2 ${defaultScrollbarStyle}`}>
				{fetchingResources || gettingWorkspaces || fetchingWorkspaces ? (
					<pre className="text-slate-500">Please wait...</pre>
				) : (
					<>
						{actionStatus.inProgress ? (
							<p className="text-slate-500">Action is in progress. Please wait...</p>
						) : (
							<pre>{resources === undefined || resources === "" ? "No resources deployed." : resources}</pre>
						)}
					</>
				)}
			</div>
		</div>
	);
}

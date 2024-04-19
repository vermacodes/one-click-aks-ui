import { useContext, useEffect, useState } from "react";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { useWebSocketContext } from "../../../../../Context/WebSocketContext";
import DropdownSelect from "../../../../../UserInterfaceComponents/DropdownSelect";

type Props = {
	index: number;
};

export default function DefaultNodeOSSKU({ index }: Props) {
    const { lab, setLab } = useGlobalStateContext();
    const { actionStatus } = useWebSocketContext();
    const { mutate: setLogs } = useSetLogs();

    const nodeOSes = ["Ubuntu", "AzureLinux"]
    const currentNodeOSSKU = lab?.template?.kubernetesClusters[index].defaultNodePool.osSku;

    function handleOnNodeOSChange(nodeOS: string) {
        // clone the lab object so we don't mutate the state directly,
        // then set the new node OS SKU and update the lab state
        const newLab = structuredClone(lab);
        const cluster = newLab?.template?.kubernetesClusters[index];

        if (!cluster?.defaultNodePool) {
            return;
        }

        if (cluster.defaultNodePool.osSku === nodeOS) {
            return
        }

        cluster.defaultNodePool.osSku = nodeOS;

        if (!actionStatus.inProgress) {
            setLogs({ logs: JSON.stringify(newLab?.template, null, 4) });
        }

        setLab(newLab);
    }

    const renderItem = (osSku: string) => {
        return (
            <div
				className={`${
					osSku === currentNodeOSSKU && "bg-green-300 hover:text-slate-900 dark:text-slate-900"
				} w-full cursor-pointer items-center justify-between rounded p-2 hover:bg-sky-500 hover:text-slate-100`}
			>
				{osSku}
			</div>
        )
    }


    /**
     * Function to render an item
     * 
     * @param {NodeOSSKUs} nodeOSSKU - string array containing OS SKU values
     * @returns JSX.Element - The rendered item
     */
    return (
        <div className="flex gap-2">
            <label htmlFor="nodeOSSKU">Node OS SKU</label>
            <DropdownSelect
                heading={currentNodeOSSKU == null ? "Ubuntu" : currentNodeOSSKU}
                items={nodeOSes}
                onItemClick={handleOnNodeOSChange}
                renderItem={renderItem}
                tooltipMessage="The operating system to use for the default node pool."
                tooltipDelay={1000}
            />
        </div>
    )
}
import { NodeOSSKUs } from "../../../../../../dataStructures";
import { useNodeOSes } from "../../../../../../hooks/useNodeOSes";
import { useSetLogs } from "../../../../../../hooks/useLogs";
import { useGlobalStateContext } from "../../../../../Context/GlobalStateContext";
import { useWebSocketContext } from "../../../../../Context/WebSocketContext";
import DropdownSelect from "../../../../../UserInterfaceComponents/DropdownSelect";

type Props = {
    index: number;
};

export default function DefaultNodeOSSKU({ index }: Props) {
    const { nodeOSes, isLoading, isFetching } = useNodeOSes();

    const { lab, setLab } = useGlobalStateContext();
    const { actionStatus } = useWebSocketContext();
    const { mutate: setLogs } = useSetLogs();

    // determine if OS selection should be disabled
    const disabled = isLoading || isFetching;

    // Determine the current node OS selection
    const currentNodeOS = lab?.template?.kubernetesClusters[index]?.defaultNodePool?.nodeOSSKU;

    /**
     * Handles selection of the node OS SKU to use for the default node pool
     * 
     * @param {NodeOSSKUs} nodeOS - The selected node OS SKU
     */
    const handleOnSelect = (nodeOS: string[]) => {
        const nodeOSKey = Object.keys(nodeOS)[0];
        const newLab = structuredClone(lab);
        if (newLab?.template && newLab.template.kubernetesClusters[index]) {
            newLab.template.kubernetesClusters[index].defaultNodePool.nodeOSSKU = nodeOSKey;
            !actionStatus.inProgress &&
                setLogs({ logs: JSON.stringify(newLab.template, null, 4) });
            setLab(newLab);
        }
    };

    /**
     * Function to render an item
     * 
     * @param {NodeOSSKUs} nodeOSSKU - string array containing OS SKU values
     * @returns JSX.Element - The rendered item
     */
    const renderItem = (nodeOSSKU: string[]) => {
        // Determine the class to apply based on whether the current node OS value matches the 




        const key = Object.keys(nodeOSSKU)[0];

        // Determine the classes to apply based on whether the node OS value matches the keu
        const classes = 
            key === currentNodeOS
            ? "bg-green-300 hover:text-slate-900 dark:text-slate-900"
            : "";
        
        return (
            <div
                className={`${classes} mt-2 w-full cursor-pointer items-center justify-between gap-2 rounded p-2 hover:bg-sky-500 hover:text-slate-100`}
            >
                <div className="flex justify-between">
                    <div key={key}>{key}</div>
                </div>
                <div className="space-x-2 text-xs text-slate-500">
                    Node OS SKUs :
                    {nodeOSSKU[key].map((sku) => (
                        <span key={sku}>{sku}</span>
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div className="w-64">
            <DropdownSelect
                disabled={disabled}
                heading={isLoading || isFetching ? "Please wait..." : currentNodeOS}
                items={nodeOSes}
                onItemClick={handleOnSelect}
                renderItem={renderItem}
                width={"full"}
                height={"h-60"}
            />
        </div>
    )
}
import { useEffect, useState } from "react";
import { NodeOSSKUs, Value } from "../dataStructures";
import { axiosInstance } from "../utils/axios-interceptors";
import { useQuery } from "react-query";

function getNodeOSes() {
    return useQuery("osskus", () => axiosInstance.get("osskus"), {
        select: (data): NodeOSSKUs => {
            return data.data;
        },
        cacheTime: 10 * 60 * 1000,
        staleTime: 10 * 60 * 1000,
    
    });
}

export function useNodeOSes() {
    const [nodeOSes, setNodeOSes] = useState<string[]>([]);
    const [defaultNodeOS, setDefaultNodeOS] = useState<string>("");
    const { data } = getNodeOSes();

    // Effect hook to filter and set node OSes
    useEffect(() => {
        if (data?.OSes) {
            let skus: string[] = [];
            data?.OSes.forEach((value) => {
                nodeOSes.push(value);
            });
            setNodeOSes(nodeOSes);
        }
    }, [data]);

    /**
     * This `useEffect` hook is triggered when `data` changes.
     * If `data.values` is defined, it sets the default node OS to "Ubuntu" by calling `getDefaultNodeOS`.
     */
    useEffect(() => {
        if (data?.OSes) {
            setDefaultNodeOS(getDefaultNodeOS());
        }
    }, [data]);

    
    function getDefaultNodeOS(): string {
        // todo - how do we want to handle this? in theory this should be
        // configurable by the user, but for now we'll just return Ubuntu
        // since it's the most used node OS at this point
        return "Ubuntu";
    }

    return { nodeOSes, isLoading: !data, isFetching: !data };
};
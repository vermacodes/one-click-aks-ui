import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Lab } from "../dataStructures";
import { actlabsHubAxiosInstance, axiosInstance } from "../utils/axios-interceptors";

function getSharedMockCases(): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance("/lab/protected/mockcase");
}

export function useSharedMockCases() {
	return useQuery("get-mockcases", getSharedMockCases, {
		select: (data): Lab[] => {
			return data.data;
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
}

// function getTemplates(): Promise<AxiosResponse<Lab[]>> {
//   return axiosInstance("lab/my");
// }

// export function useTemplates() {
//   return useQuery("my-templates", getTemplates, {
//     select: (data): Lab[] => {
//       return data.data;
//     },
//     cacheTime: Infinity,
//     staleTime: Infinity,
//   });
// }

function getSharedTemplates(): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance("lab/public/publiclab");
}

export function useSharedTemplates() {
	return useQuery("get-publiclabs", getSharedTemplates, {
		select: (data): Lab[] => {
			return data.data;
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
}

function getPrivateLabs(): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance.get("lab/private/privatelab");
}

export function usePrivateLabs() {
	return useQuery("get-privatelabs", getPrivateLabs, {
		select: (data): Lab[] => {
			return data.data;
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
}

function getChallengeLabs(): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance.get("lab/private/challengelab");
}

export function useChallengeLabs() {
	return useQuery("get-challengelabs", getChallengeLabs, {
		select: (data): Lab[] => {
			return data.data;
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
}

function getReadinessLabs(): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance.get("lab/protected/readinesslab");
}

export function useReadinessLabs() {
	return useQuery("get-readinesslabs", getReadinessLabs, {
		select: (data): Lab[] => {
			return data.data;
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
}

function createLab(lab: Lab): Promise<AxiosResponse<Lab>> {
	if (lab.type === "mockcase" || lab.type === "readinesslab") {
		return actlabsHubAxiosInstance.post("/lab/protected", lab);
	}
	if (lab.type === "challengelab" || lab.type === "privatelab") {
		return actlabsHubAxiosInstance.post("/lab/private", lab);
	}

	// Public Labs
	return actlabsHubAxiosInstance.post("/lab/public", lab);
}

export function useCreateLab() {
	const queryClient = useQueryClient();
	return useMutation(createLab, {
		onSuccess: () => {
			queryClient.invalidateQueries("my-templates");
			queryClient.invalidateQueries("get-privatelabs");
			queryClient.invalidateQueries("get-publiclabs");
			queryClient.invalidateQueries("get-mockcases");
			queryClient.invalidateQueries("get-readinesslabs");
			queryClient.invalidateQueries("get-challengelabs");
			queryClient.invalidateQueries("get-all-readiness-labs-redacted");
		},
	});
}

function createLabWithSupportingDocument(lab: Lab, supportingDocument: File): Promise<AxiosResponse<Lab>> {
	const formData = new FormData();
	formData.append("lab", JSON.stringify(lab));
	formData.append("supportingDocument", supportingDocument);

	let url = "/lab/public/withSupportingDocument";
	if (lab.type === "mockcase" || lab.type === "readinesslab") {
		url = "/lab/protected/withSupportingDocument";
	} else if (lab.type === "challengelab" || lab.type === "privatelab") {
		url = "/lab/private/withSupportingDocument";
	}

	return actlabsHubAxiosInstance.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

// TODO: Optimistic updates
// ?: Will it make sense to separate create and update functions? Right now server is handling updates.
export function useCreateLabWithSupportingDocument() {
	const queryClient = useQueryClient();
	return useMutation((params: [Lab, File]) => createLabWithSupportingDocument(params[0], params[1]), {
		onSuccess: () => {
			queryClient.invalidateQueries("my-templates");
			queryClient.invalidateQueries("get-privatelabs");
			queryClient.invalidateQueries("get-publiclabs");
			queryClient.invalidateQueries("get-mockcases");
			queryClient.invalidateQueries("get-readinesslabs");
			queryClient.invalidateQueries("get-challengelabs");
			queryClient.invalidateQueries("get-all-readiness-labs-redacted");
		},
	});
}

function deleteLab(lab: Lab) {
	return actlabsHubAxiosInstance.delete(`lab/${lab.category}/${lab.type}/${lab.id}`);
}

// TODO: Optimistic updates
export function useDeleteLab() {
	const queryClient = useQueryClient();
	return useMutation(deleteLab, {
		onSuccess: () => {
			queryClient.invalidateQueries("my-templates");
			queryClient.invalidateQueries("get-privatelabs");
			queryClient.invalidateQueries("get-publiclabs");
			queryClient.invalidateQueries("get-mockcases");
			queryClient.invalidateQueries("get-readinesslabs");
			queryClient.invalidateQueries("get-challengelabs");
			queryClient.invalidateQueries("get-all-readiness-labs-redacted");
		},
	});
}

function createMyLab(lab: Lab): Promise<AxiosResponse<Lab[]>> {
	return axiosInstance.post("/lab", lab);
}

// TODO: Optimistic updates
// ?: Will it make sense to separate create and update functions? Right now server is handling updates.
export function useCreateMyLab() {
	const queryClient = useQueryClient();
	return useMutation(createMyLab, {
		onSuccess: () => {
			queryClient.invalidateQueries("my-templates");
		},
	});
}

function deleteMyLab(lab: Lab) {
	return axiosInstance.delete("lab", { data: lab });
}

// TODO: Optimistic updates
export function useDeleteMyLab() {
	const queryClient = useQueryClient();
	return useMutation(deleteMyLab, {
		onSuccess: () => {
			queryClient.invalidateQueries("my-templates");
		},
	});
}

function getVersionsByTypeAndId({
	id,
	typeOfLab,
	categoryOfLab,
}: {
	id: string | undefined;
	typeOfLab: string | undefined;
	categoryOfLab: string;
}): Promise<AxiosResponse<Lab[]>> {
	return actlabsHubAxiosInstance.get(`lab/${categoryOfLab}/versions/${typeOfLab}/${id}`);
}

export function useGetVersionsById(
	id: string | undefined,
	typeOfLab: string | undefined,
	categoryOfLab: string = "public"
) {
	const queryKey = ["lab-versions", id, typeOfLab, categoryOfLab];
	return useQuery(queryKey, () => getVersionsByTypeAndId({ id, typeOfLab, categoryOfLab }), {
		select: (data): Lab[] => {
			return data.data;
		},
	});
}

// Supporting Documents

const upsertSupportingDocument = async (supportingDocument: File) => {
	const formData = new FormData();
	formData.append("supportingDocument", supportingDocument);
	const response = await actlabsHubAxiosInstance.post("lab/protected/supportingDocument", formData);
	return response.data;
};

export function useUpsertSupportingDocument() {
	const queryClient = useQueryClient();
	return useMutation(upsertSupportingDocument, {
		onSuccess: () => {
			queryClient.invalidateQueries("get-supporting-documents");
		},
	});
}

const getSupportingDocument = async (supportingDocumentId: string) => {
	const response = await actlabsHubAxiosInstance.get(`lab/protected/supportingDocument/${supportingDocumentId}`, {
		responseType: "blob",
	});
	return response.data;
};

export function useSupportingDocument(supportingDocumentId: string) {
	return useQuery(["supporting-document", supportingDocumentId], () => getSupportingDocument(supportingDocumentId), {
		select: (data): Blob => {
			return data;
		},
		enabled: supportingDocumentId !== "",
	});
}

const deleteSupportingDocument = async (supportingDocumentId: string) => {
	const response = await actlabsHubAxiosInstance.delete(`lab/protected/supportingDocument/${supportingDocumentId}`);
	return response.data;
};

export function useDeleteSupportingDocument() {
	return useMutation(deleteSupportingDocument, {});
}

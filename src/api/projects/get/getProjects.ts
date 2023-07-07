import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedProject } from "../types";

export async function getProjects(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedProject>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statuscode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `${orderBy}`;
		}

		const url = `/projects?page=${currentPage}&postsperpage=${pageSize}${queryParam}`;

		const response = await instance.get<APIPaginatedProject>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

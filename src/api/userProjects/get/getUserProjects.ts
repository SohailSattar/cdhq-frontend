import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPaginatedUserProject } from "../types";

export async function getUserProjects(
	id: string,
	currentPage: number = 1,
	pageSize: number = 50,
	keyword?: string
): Promise<APIResponse<APIPaginatedUserProject>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		const url =
			`/users/${id}/projects?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam;

		const response = await instance.get<APIPaginatedUserProject>(url, config);
		const data = response.data;

		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

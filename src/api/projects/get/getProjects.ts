import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedProject } from "../types";

export async function getProjects(
	currentPage: number,
	pageSize: number,
	statusCode?: Id
): Promise<APIResponse<APIPaginatedProject>> {
	try {
		const config = getConfig();

		let codeParameter = "";

		if (statusCode) {
			codeParameter = `&statuscode=${statusCode}`;
		}

		const url = `/projects?page=${currentPage}&postsperpage=${pageSize}${codeParameter}`;

		const response = await instance.get<APIPaginatedProject>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

import { instance } from "../../../network";
import { APIResponse, getConfig } from "../..";
import { APIPaginatedProjectUser } from "../types";
import { Id } from "../../../utils";

export async function getProjectUsers(
	id: Id,
	keyword?: string,
	departmentId?: Id,
	currentPage: number = 1,
	pageSize: number = 50
): Promise<APIResponse<APIPaginatedProjectUser>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		// if (statusCode) {
		// 	queryParam += `&statusCode=${statusCode}`;
		// }

		// if (roleId) {
		// 	queryParam += `&type=${roleId}`;
		// }

		if (departmentId) {
			queryParam += `&departmentId=${departmentId}`;
		}

		// if (orderBy) {
		// 	queryParam += `${orderBy}`;
		// }
		const url =
			`/projects/${id}/users?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam!;

		const response = await instance.get<APIPaginatedProjectUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

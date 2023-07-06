import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIResponse } from "../../types";
import { APIPaginatedUser } from "../types";

export async function getUsers(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	projectId?: Id,
	statusCode?: Id,
	roleId?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (roleId) {
			queryParam += `&type=${roleId}`;
		}

		if (projectId) {
			queryParam += `&projectId=${projectId}`;
		}

		if (orderBy) {
			queryParam += `${orderBy}`;
		}

		const url =
			`/users?page=${currentPage}&postsperpage=${pageSize}` + queryParam!;

		const response = await instance.get<APIPaginatedUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		return { error: err };
	}
}

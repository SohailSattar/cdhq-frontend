import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIDepartmentItem, APIPaginatedDepartment } from "../types";

import { DEPARTMENTS } from "../../ROUTES";

export async function getDepartments(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedDepartment>> {
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

		const url = `${DEPARTMENTS}?page=${currentPage}&postsperpage=${pageSize}${queryParam}`;

		const response = await instance.get<APIPaginatedDepartment>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

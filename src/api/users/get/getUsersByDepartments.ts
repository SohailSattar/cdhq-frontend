// This is a POST request mentioned as getUsersByDepartments because it shall return the list in return

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedUser } from "../types";

export async function getUsersByDepartments(
	currentPage: number,
	pageSize: number,
	deptIds: string[],
	keyword: string = "",
	statusCode?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		let parameter = "";

		if (keyword) {
			parameter += `&keyword=${keyword}`;
		}

		if (statusCode) {
			parameter += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			parameter += `${orderBy}`;
		}

		let url = `/departments/users?page=${currentPage}&postsperpage=${pageSize}${parameter}`;

		const response = await instance.post<APIPaginatedUser>(
			url,
			{
				ids: deptIds,
			},
			config
		);

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

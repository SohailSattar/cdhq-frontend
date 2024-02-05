import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPagedPhoneDirectory } from "../types";

import { PHONE_DIRECTORY } from "../../ROUTES";

export async function getPhoneDirectoryByDepartment(
	currentPage: number = 1,
	pageSize: number = 50,
	keyword: string = "",
	deptIds: string[],
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPagedPhoneDirectory>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const response = await instance.post<APIPagedPhoneDirectory>(
			`${PHONE_DIRECTORY}?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}${queryParam}`,
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

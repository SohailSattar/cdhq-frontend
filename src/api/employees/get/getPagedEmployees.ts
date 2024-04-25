import { APIQueryParams, APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeListItem, APIPaginatedEmployees } from "../types";

import { EMPLOYEES } from "../../ROUTES";

export async function getPagedEmployees(
	queryParams: APIQueryParams
): Promise<APIResponse<APIPaginatedEmployees>> {
	try {
		const config = getConfig();

		const { page, postsPerPage, keyword, statusCode, orderBy, isDescending } =
			queryParams;

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

		const url = `${EMPLOYEES}?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.get<APIPaginatedEmployees>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

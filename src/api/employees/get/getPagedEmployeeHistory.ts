import { APIQueryParams, APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPaginatedEmployeeHistory } from "../types";

import { EMPLOYEES } from "../../ROUTES";

export async function getPagedEmployeeHistory(
	id: number,
	queryParams: APIQueryParams
): Promise<APIResponse<APIPaginatedEmployeeHistory>> {
	try {
		const config = getConfig();

		const { page, postsPerPage, orderBy, isDescending } = queryParams;

		let queryParam = "";

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url = `${EMPLOYEES}/${id}/history?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.get<APIPaginatedEmployeeHistory>(
			url,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

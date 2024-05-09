import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIQueryParams, APIResponse } from "../../types";
import { APIPaginatedEmployees } from "../types";

import { EMPLOYEES } from "../../ROUTES";

export async function getFilteredEmployees(
	filters: ColumnFiltersState,
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

		const url = `${EMPLOYEES}/filter?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.post<APIPaginatedEmployees>(
			url,
			filters,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		return { error: err };
	}
}

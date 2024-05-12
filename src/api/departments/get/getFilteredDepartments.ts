import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIQueryParams, APIResponse } from "../../types";
import { APIPaginatedDepartment } from "../types";

import { DEPARTMENTS, EMPLOYEES } from "../../ROUTES";

export async function getFilteredDepartments(
	filters: ColumnFiltersState,
	queryParams: APIQueryParams
): Promise<APIResponse<APIPaginatedDepartment>> {
	try {
		const config = getConfig();

		const { page, postsPerPage, keyword, statusCode, orderBy, isDescending } =
			queryParams;

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statuscode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url = `${DEPARTMENTS}/filter?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.post<APIPaginatedDepartment>(
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

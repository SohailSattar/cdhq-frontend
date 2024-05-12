import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIQueryParams, APIResponse } from "../../types";
import { PaginatedMenuItem } from "../types";

import { MENU } from "../../ROUTES";

export async function getFilteredMenuList(
	filters: ColumnFiltersState,
	queryParams: APIQueryParams
): Promise<APIResponse<PaginatedMenuItem>> {
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

		const url = `${MENU}/all/paged/filter?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.post<PaginatedMenuItem>(
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

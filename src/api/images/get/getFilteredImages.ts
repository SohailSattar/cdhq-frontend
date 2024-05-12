import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIQueryParams, APIResponse } from "../../types";
import { APIPaginatedImage } from "../types";

import { MENU } from "../../ROUTES";

export async function getFilteredImages(
	filters: ColumnFiltersState,
	queryParams: APIQueryParams
): Promise<APIResponse<APIPaginatedImage>> {
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

		const url = `/images/filter?page=${page}&postsperpage=${postsPerPage}${queryParam}`;

		const response = await instance.post<APIPaginatedImage>(
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

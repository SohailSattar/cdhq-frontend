import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIResponse } from "../../types";
import { APIPaginatedHonors } from "../types";

export async function getFilteredHonors(
	filters: ColumnFiltersState,
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedHonors>> {
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

		const url =
			`/honors/filter?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam!;

		const response = await instance.post<APIPaginatedHonors>(
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

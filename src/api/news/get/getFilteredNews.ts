import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIResponse } from "../../types";
import { APIPaginatedNews } from "../types";

export async function getFilteredNews(
	filters: ColumnFiltersState,
	currentPage: number = 1,
	pageSize: number = 50,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedNews>> {
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
			`/news/filter?page=${currentPage}&postsperpage=${pageSize}` + queryParam!;

		const response = await instance.post<APIPaginatedNews>(
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

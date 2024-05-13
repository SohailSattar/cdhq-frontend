import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIResponse } from "../../types";
import { APIPaginatedProjectUser } from "../types";

export async function getFilteredUsersByProjects(
	id: Id,
	filters: ColumnFiltersState,
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedProjectUser>> {
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
			`/projects/${id}/users/filter?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam!;

		const response = await instance.post<APIPaginatedProjectUser>(
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

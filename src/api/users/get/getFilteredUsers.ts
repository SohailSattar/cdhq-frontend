import { ColumnFiltersState } from "@tanstack/react-table";
import { getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIColumnFilters, APIResponse } from "../../types";
import { APIPaginatedUser } from "../types";

export async function getFilteredUsers(
	filters: ColumnFiltersState,
	currentPage: number,
	pageSize: number,
	keyword?: string,
	projectId?: Id,
	statusCode?: Id,
	roleId?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (roleId) {
			queryParam += `&type=${roleId}`;
		}

		if (projectId) {
			queryParam += `&projectId=${projectId}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url =
			`/users/filter?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam!;

		const response = await instance.post<APIPaginatedUser>(
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

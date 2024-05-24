// This is a POST request mentioned as getUsersByDepartments because it shall return the list in return

import { ColumnFiltersState } from "@tanstack/react-table";
import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedEmployees } from "../types";

export async function getFilteredEmployeesByDepartments(
	filters: ColumnFiltersState,
	currentPage: number,
	pageSize: number,
	deptIds: string[],
	keyword: string = "",
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedEmployees>> {
	try {
		const config = getConfig();

		let parameter = "";

		if (keyword) {
			parameter += `&keyword=${keyword}`;
		}

		if (statusCode) {
			parameter += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			parameter += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		let url = `/departments/employees/filter?page=${currentPage}&postsperpage=${pageSize}${parameter}`;

		const response = await instance.post<APIPaginatedEmployees>(
			url,
			{
				deptIds: { ids: deptIds },
				filters: filters,
			},
			config
		);

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

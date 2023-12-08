import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { PaginatedMenuItem } from "../types";

export async function getMenuListPaginated(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	parentId?: Id,
	menuTypeId?: Id,
	categoryId?: Id,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<PaginatedMenuItem>> {
	try {
		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (parentId) {
			queryParam += `&parentId=${parentId}`;
		}

		if (menuTypeId) {
			queryParam += `&type=${menuTypeId}`;
		}

		if (categoryId) {
			queryParam += `&categoryId=${categoryId}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url =
			`/menu/all/paged?page=${currentPage}&postsperpage=${pageSize}` +
			queryParam!;

		const response = await instance.get<PaginatedMenuItem>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIPaginatedNews } from "../types";

export async function getNews(
	currentPage: number = 1,
	pageSize: number = 50,
	parameter?: string
): Promise<APIResponse<APIPaginatedNews>> {
	try {
		const url = `/news?page=${currentPage}&postsperpage=${pageSize}`;

		const response = await instance.get<APIPaginatedNews>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

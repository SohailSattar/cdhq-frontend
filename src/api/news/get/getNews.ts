import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPaginatedNews } from "../types";

export async function getNews(
	currentPage: number = 1,
	pageSize: number = 50,
	keyword?: string
): Promise<APIResponse<APIPaginatedNews>> {
	try {
		const config = getConfig();

		if (!keyword) {
			keyword = "";
		}

		const url = `/news?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}`;

		const response = await instance.get<APIPaginatedNews>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

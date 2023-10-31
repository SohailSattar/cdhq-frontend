import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedNews } from "../types";

export async function getNews(
	currentPage: number = 1,
	pageSize: number = 50,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string
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
			queryParam += `${orderBy}`;
		}

		const url = `/news?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}${queryParam}`;

		console.log(url);

		const response = await instance.get<APIPaginatedNews>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

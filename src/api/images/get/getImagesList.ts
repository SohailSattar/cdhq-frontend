import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedImage } from "../types";

export async function getImagesList(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	typeId?: Id,
	statusCode?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedImage>> {
	try {
		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (typeId) {
			queryParam += `&typeId=${statusCode}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `${orderBy}`;
		}

		const url =
			`/images?page=${currentPage}&postsperpage=${pageSize}` + queryParam!;

		const response = await instance.get<APIPaginatedImage>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

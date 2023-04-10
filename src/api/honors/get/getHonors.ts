import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIPaginatedHonors } from "../types";

export async function getHonors(
	currentPage: number = 1,
	pageSize: number = 50,
	parameter?: string
): Promise<APIResponse<APIPaginatedHonors>> {
	try {
		const url = `/honors?page=${currentPage}&postsperpage=${pageSize}`;

		const response = await instance.get<APIPaginatedHonors>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPagedPhoneDirectory } from "../types";

export async function getPhoneDirectoryList(
	currentPage: number = 1,
	pageSize: number = 20,
	keyword: string = "",
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPagedPhoneDirectory>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url = `/phone-directory?page=${currentPage}&postsperpage=${pageSize}${queryParam}`;

		const response = await instance.get<APIPagedPhoneDirectory>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPagedPhoneDirectory } from "../types";

export async function getPhoneDirectoryByDepartment(
	id: number,
	currentPage: number = 1,
	pageSize: number = 50,
	keyword: string = ""
): Promise<APIResponse<APIPagedPhoneDirectory>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIPagedPhoneDirectory>(
			`/phone-directory/${id}?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

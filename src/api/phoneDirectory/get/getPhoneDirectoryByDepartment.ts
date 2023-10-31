import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPagedPhoneDirectory } from "../types";

export async function getPhoneDirectoryByDepartment(
	currentPage: number = 1,
	pageSize: number = 50,
	keyword: string = "",
	deptIds: string[],
	orderBy?: string
): Promise<APIResponse<APIPagedPhoneDirectory>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (orderBy) {
			queryParam += `${orderBy}`;
		}

		const response = await instance.post<APIPagedPhoneDirectory>(
			`/phone-directory?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}${queryParam}`,
			{
				ids: deptIds,
			},
			config
		);

		console.log(deptIds);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

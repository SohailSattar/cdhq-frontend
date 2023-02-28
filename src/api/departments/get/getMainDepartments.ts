import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentItem } from "../types";

export async function getMainDepartments(
	code?: string,
	projectId?: number
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		const config = getConfig();

		let keyword = "";
		if (code) {
			keyword = `keyword=${code}`;
		}

		let projectIdParam = "";
		if (keyword !== "" && projectId) {
			projectIdParam = "&";
		}

		if (projectId) {
			projectIdParam += `projectid=6110`;
		}

		const url = `/departments/main?` + keyword + projectIdParam;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

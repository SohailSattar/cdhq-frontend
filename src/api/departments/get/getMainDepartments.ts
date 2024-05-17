import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentItem } from "../types";

export async function getMainDepartments(
	code?: string,
	projectId?: number,
	accessType?: string
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		const config = getConfig();

		if (!code) {
			code = "M1";
		}

		let keyword = "";
		let projectIdParam = "";
		if (projectId) {
			projectIdParam = "?";
		}

		if (projectId) {
			projectIdParam += `projectid=${projectId}`;
		}

		if (accessType) {
			projectIdParam += `&type=${accessType}`;
		}

		const url = `/departments/main/${code}` + keyword + projectIdParam;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

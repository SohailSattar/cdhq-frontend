import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIDepartmentItem } from "../types";

export async function getDepartmentsByProject(
	projectId: Id,
	all: boolean = false
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		const config = getConfig();

		let keyword = "";

		if (all) {
			keyword = `?keyword=all`;
		}

		const url = `/projects/${projectId}/departments${keyword}`;

		console.log(url);

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

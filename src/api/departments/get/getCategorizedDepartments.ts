import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APICategorizedDepartment } from "../types";

export async function getCategorizedDepartments(
	projectId?: Id,
	accessType?: string
): Promise<APIResponse<APICategorizedDepartment[]>> {
	try {
		const config = getConfig();

		let keyword = "";

		if (projectId) {
			keyword = `?projectId=${projectId}`;
		}

		if (accessType) {
			keyword += `&type=${accessType}`;
		}

		const url = `/departments/categorized` + keyword;

		const response = await instance.get<APICategorizedDepartment[]>(
			url,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

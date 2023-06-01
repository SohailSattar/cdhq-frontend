import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIUserProjectDetail2 } from "../types";

export async function getUserProjectByDepartment(
	projectId: Id,
	departmentId: Id
): Promise<APIResponse<APIUserProjectDetail2>> {
	try {
		const config = getConfig();

		const url = `/user-projects/${projectId}/${departmentId}`;

		const response = await instance.get<APIUserProjectDetail2>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

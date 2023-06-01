import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIUserProjectPrivilege } from "../types";

export async function checkPrivilegeForProjectUser(
	userId: Id,
	projectId: Id
): Promise<APIResponse<APIUserProjectPrivilege>> {
	try {
		const config = getConfig();

		const url = `/user-projects/${projectId}/${userId}/privilege`;

		const response = await instance.get<APIUserProjectPrivilege>(url, config);
		const data = response.data;
		console.log(data);
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

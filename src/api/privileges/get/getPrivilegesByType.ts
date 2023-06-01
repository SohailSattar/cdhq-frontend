import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPrivilege } from "../type";

export async function getPrivilegesByType(
	id: Id
): Promise<APIResponse<APIPrivilege[]>> {
	try {
		const config = getConfig();

		const url = `/privileges/${id}/list`;

		const response = await instance.get<APIPrivilege[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

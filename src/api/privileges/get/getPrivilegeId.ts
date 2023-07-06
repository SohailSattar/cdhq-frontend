import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPrivilege } from "../type";

export async function getPrivilegeId(code: string): Promise<APIResponse<Id>> {
	try {
		const config = getConfig();

		const url = `/privileges/code/${code}`;

		const response = await instance.get<Id>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

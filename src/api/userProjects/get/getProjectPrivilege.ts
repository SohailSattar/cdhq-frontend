import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserProjectPrivilege } from '../types';

export async function getProjectPrivilege(
	projectId: number
): Promise<APIResponse<APIUserProjectPrivilege>> {
	try {
		const config = getConfig();

		const url = `/user-projects/${projectId}/privilege`;

		const response = await instance.get<APIUserProjectPrivilege>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

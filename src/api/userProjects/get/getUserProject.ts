import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserProjectDetail } from '../types';

export async function getUserProject(
	id: string
): Promise<APIResponse<APIUserProjectDetail>> {
	try {
		const config = getConfig();

		const url = `/user-projects/${id}`;

		const response = await instance.get<APIUserProjectDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

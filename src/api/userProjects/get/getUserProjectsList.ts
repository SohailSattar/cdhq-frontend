import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserProjectItem } from '../types';

export async function getUserProjectsList(
	id: number
): Promise<APIResponse<APIUserProjectItem[]>> {
	try {
		const config = getConfig();

		const url = `/users/${id}/projects/list`;

		const response = await instance.get<APIUserProjectItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

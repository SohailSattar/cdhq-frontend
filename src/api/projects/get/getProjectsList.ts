import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectItem } from '../types';

export async function getProjectsList(): Promise<
	APIResponse<APIProjectItem[]>
> {
	try {
		const config = getConfig();

		const url = '/projects/list';

		const response = await instance.get<APIProjectItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

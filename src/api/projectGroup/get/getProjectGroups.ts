import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectGroup } from '../types';

export async function getProjectGroups(): Promise<
	APIResponse<APIProjectGroup[]>
> {
	try {
		const config = getConfig();

		const url = `/projects/groups`;

		const response = await instance.get<APIProjectGroup[]>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

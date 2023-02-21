import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectHierarchy } from '../types';

export async function getProjectsHierarchy(): Promise<
	APIResponse<APIProjectHierarchy[]>
> {
	try {
		const config = getConfig();

		const url = `/projects/hierarchy`;

		const response = await instance.get<APIProjectHierarchy[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

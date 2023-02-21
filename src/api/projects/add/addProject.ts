import { instance } from '../../../network';
import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { APINewProject } from '../types';

export async function addProject(
	projectParams: APINewProject
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.post<APIResponseStatus>(
			'/projects/',
			projectParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

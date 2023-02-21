import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUpdateProjectStatus } from '../types';

export async function updateProjectStatus(
	updateStatusParams: APIUpdateProjectStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = '/projects/status';

		const response = await instance.put<APIResponseStatus>(
			url,
			updateStatusParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectStatus } from '../types';

export async function updateUserProjectStatus(
	updateProjectStatusParams: APIProjectStatus
): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		const url = '/users/project/status';

		await instance.put<APIProjectStatus>(
			url,
			updateProjectStatusParams,
			config
		);
		const data = true;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

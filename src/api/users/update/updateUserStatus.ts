import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUpdateUserStatus } from '../types';

export async function updateUserStatus(
	updateStatusParams: APIUpdateUserStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = '/users/status';

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

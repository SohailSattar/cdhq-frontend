import { instance } from '../../../network';
import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { APINewUser } from '../types';

export async function addUser(
	userParams: APINewUser
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.post<APIResponseStatus>(
			'/users/',
			userParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

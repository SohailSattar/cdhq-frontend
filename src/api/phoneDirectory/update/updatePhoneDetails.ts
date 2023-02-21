import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPhoneDetail } from '../types';

export async function updatePhoneDetails(
	updateUserParams: APIPhoneDetail): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = '/phone-directory';

		const response = await instance.put<APIResponseStatus>(
			url,
			updateUserParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

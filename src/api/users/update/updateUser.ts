import { getConfig } from '../..';
import { instance } from '../../../network';
import { APIResponse, APIResponseStatus } from '../../types';
import { APIUpdateUser } from '../types';

export const updateUser = async (
	updateUserParams: APIUpdateUser
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = '/users';

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
};

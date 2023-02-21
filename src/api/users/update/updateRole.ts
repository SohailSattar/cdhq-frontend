import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUpdateUserRole } from '../types';

export async function updateRole(
	updateRoleParams: APIUpdateUserRole
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = '/users/role';

		const response = await instance.put<APIResponseStatus>(
			url,
			updateRoleParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

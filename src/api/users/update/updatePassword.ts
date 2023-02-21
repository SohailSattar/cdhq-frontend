import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APILoginUser } from '../types';

export async function updatePassword(
	updatePasswordParams: APILoginUser
): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		const url = '/account/password';

		await instance.put<APILoginUser>(url, updatePasswordParams, config);
		const data = true;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

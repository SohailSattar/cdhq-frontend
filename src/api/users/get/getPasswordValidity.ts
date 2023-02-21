import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPasswordValidity } from '../types';

export async function getPasswordValidity(): Promise<
	APIResponse<APIPasswordValidity>
> {
	try {
		const config = getConfig();

		const url = `/account/password-expiry`;

		const response = await instance.get<APIPasswordValidity>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

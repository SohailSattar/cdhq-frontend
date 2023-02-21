import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserDetail } from '../types';

export async function getUserDetail(
	logName: string
): Promise<APIResponse<APIUserDetail>> {
	try {
		const config = getConfig();

		const url = `/users/${logName}`;

		const response = await instance.get<APIUserDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		const e = error.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIWorkMode } from '../types';

export async function getWorkMode(): Promise<APIResponse<APIWorkMode[]>> {
	try {
		const config = getConfig();

		const url = `/work-mode`;

		const response = await instance.get<APIWorkMode[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

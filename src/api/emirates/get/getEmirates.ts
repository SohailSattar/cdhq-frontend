import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIEmirate } from '../types';

export async function getEmirates(): Promise<APIResponse<APIEmirate[]>> {
	try {
		const config = getConfig();

		const url = `/emirates`;

		const response = await instance.get<APIEmirate[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserRole } from '../types';

export async function getRole(id: string): Promise<APIResponse<APIUserRole>> {
	try {
		const config = getConfig();

		const url = `/users/${id}/role`;

		const response = await instance.get<APIUserRole>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

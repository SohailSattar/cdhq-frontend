import { instance } from '../../../network';
import { APIResponse, getConfig } from '../..';
import { APIRole } from '../types';

export async function getAccessRoles(): Promise<APIResponse<APIRole[]>> {
	try {
		const config = getConfig();

		const url = `/roles`;

		const response = await instance.get<APIRole[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

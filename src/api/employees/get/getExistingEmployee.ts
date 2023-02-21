import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIExistingEmployee } from '../types';

export async function getExistingEmployee(
	id: string
): Promise<APIResponse<APIExistingEmployee>> {
	try {
		const config = getConfig();

		const url = `/employees/${id}`;

		const response = await instance.get<APIExistingEmployee>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

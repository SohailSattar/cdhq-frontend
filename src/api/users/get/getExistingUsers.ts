import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIExistingUser } from '../types';

export async function getExistingUsers(
	employeeNumber: string
): Promise<APIResponse<APIExistingUser[]>> {
	try {
		const config = getConfig();

		const url = `/users/list/${employeeNumber}`;

		const response = await instance.get<APIExistingUser[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

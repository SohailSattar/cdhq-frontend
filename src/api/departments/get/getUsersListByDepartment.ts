import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIUserName } from '../../users/types';

export async function getUsersListByDepartment(
	id: string
): Promise<APIResponse<APIUserName[]>> {
	try {
		const config = getConfig();

		const url = `/departments/${id}/users/list`;

		const response = await instance.get<APIUserName[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

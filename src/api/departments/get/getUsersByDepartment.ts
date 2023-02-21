import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPaginatedUser } from '../../users/types';

export async function getUsersByDepartment(
	deptId: string
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		const url = `/departments/${deptId}/users`;

		const response = await instance.get<APIPaginatedUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

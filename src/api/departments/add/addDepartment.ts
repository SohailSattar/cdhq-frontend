import { instance } from '../../../network';
import { APIResponse, APIResponseStatus, getConfig } from '../..';
import { APICreateDepartment } from '../types';

export async function addDepartment(
	deptParams: APICreateDepartment
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.post<APIResponseStatus>(
			'/departments/',
			deptParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

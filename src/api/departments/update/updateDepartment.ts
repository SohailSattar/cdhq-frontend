import { getConfig } from '../..';
import { instance } from '../../../network';
import { APIResponse, APIResponseStatus } from '../../types';
import { APIUpdateDepartment } from '../types';

export const updateDepartment = async (
	deptParams: APIUpdateDepartment
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = '/departments';

		const response = await instance.put<APIResponseStatus>(
			url,
			deptParams,
			config
		);
		const data = response.data;
		return { data };
		// return {result};
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

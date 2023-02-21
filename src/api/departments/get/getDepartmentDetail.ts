import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIDepartmentDetail } from '../types';

export async function getDepartmentDetail(
	id: string
): Promise<APIResponse<APIDepartmentDetail>> {
	try {
		const config = getConfig();

		const url = `/departments/${id}`;

		const response = await instance.get<APIDepartmentDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIDepartmentItem } from '../types';

export async function getDepartments(): Promise<
	APIResponse<APIDepartmentItem[]>
> {
	try {
		const config = getConfig();

		const url = `/departments`;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

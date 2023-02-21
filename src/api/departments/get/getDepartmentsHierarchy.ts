import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIDepartmentHierarchy } from '../types';

export async function getDepartmentsHierarchy(): Promise<
	APIResponse<APIDepartmentHierarchy>
> {
	try {
		const config = getConfig();

		const url = `/departments/hierarchy`;

		const response = await instance.get<APIDepartmentHierarchy>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

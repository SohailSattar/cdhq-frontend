import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APICategorizedDepartment } from '../types';

export async function getCategorizedDepartments(): Promise<
	APIResponse<APICategorizedDepartment[]>
> {
	try {
		const config = getConfig();

		const url = `/departments/categorized`;

		const response = await instance.get<APICategorizedDepartment[]>(
			url,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

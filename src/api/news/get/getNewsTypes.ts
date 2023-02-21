import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APINewsType } from '../types';

export async function getNewsTypes(): Promise<APIResponse<APINewsType[]>> {
	try {
		const config = getConfig();

		const url = `/news/types`;

		const response = await instance.get<APINewsType[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

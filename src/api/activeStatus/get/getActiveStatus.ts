import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIActiveStatus } from '../types';

export async function getActiveStatus(
	id: number
): Promise<APIResponse<APIActiveStatus>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIActiveStatus>(
			`/active-status/${id}`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

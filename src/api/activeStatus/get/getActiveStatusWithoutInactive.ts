import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIActiveStatus } from '../types';

export async function getActiveStatusWithoutInactive(): Promise<
	APIResponse<APIActiveStatus[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIActiveStatus[]>(
			`/active-status/no-inactive`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

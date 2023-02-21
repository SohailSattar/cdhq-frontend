import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APILoggedUser } from '../types';

export async function getMyDetail(): Promise<APIResponse<APILoggedUser>> {
	try {
		const config = getConfig();

		const url = `/users/me`;

		const response = await instance.get<APILoggedUser>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		const e = error.response.data;
		return { error };
	}
}

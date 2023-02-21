import { instance } from '../../../network';
import { APIResponse, getConfig } from '../..';
import { APIRank } from '../types';

export async function getRanks(): Promise<APIResponse<APIRank[]>> {
	try {
		const config = getConfig();
		
		const response = await instance.get<APIRank[]>(`/ranks`,config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

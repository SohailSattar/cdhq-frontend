import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPrivilege } from '../type';

export async function getPrivileges(): Promise<APIResponse<APIPrivilege[]>> {
	try {
		const config = getConfig();
		const response = await instance.get<APIPrivilege[]>('/privileges', config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

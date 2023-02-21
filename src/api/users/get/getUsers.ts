import { getConfig } from '../..';
import { instance } from '../../../network';
import { APIResponse } from '../../types';
import { APIPaginatedUser } from '../types';

export async function getUsers(
	currentPage: number,
	pageSize: number,
	parameter?: string
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		if (parameter === undefined) {
			parameter = '';
		}

		const url =
			`/users?page=${currentPage}&postsperpage=${pageSize}` + parameter!;

		const response = await instance.get<APIPaginatedUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		return { error: err };
	}
}

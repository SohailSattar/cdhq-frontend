import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPaginatedUser } from '../types';

export async function getUsersByKeyword(
	keyword: string,
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
			`/users/search/${keyword}?page=${currentPage}&postsperpage=${pageSize}` +
			parameter;

		const response = await instance.get<APIPaginatedUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

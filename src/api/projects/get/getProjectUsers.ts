import { instance } from '../../../network';
import { APIResponse, getConfig } from '../..';
import { APIPaginatedProjectUser } from '../types';

export async function getProjectUsers(
	id: string,
	keyword?: string,
	currentPage: number = 1,
	pageSize: number = 50
): Promise<APIResponse<APIPaginatedProjectUser>> {
	try {
		const config = getConfig();

		if (!keyword) {
			keyword = '';
		}

		const url = `/projects/${id}/users?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}`;

		const response = await instance.get<APIPaginatedProjectUser>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

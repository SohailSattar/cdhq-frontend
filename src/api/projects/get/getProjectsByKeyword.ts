import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPaginatedProject } from '../types';

export async function getProjectsByKeyword(
	keyword: string,
	currentPage: number,
	pageSize: number
): Promise<APIResponse<APIPaginatedProject>> {
	try {
		const config = getConfig();

		const url = `/projects/list/${keyword}?page=${currentPage}&postsperpage=${pageSize}`;

		const response = await instance.get<APIPaginatedProject>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

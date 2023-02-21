import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPaginatedProject } from '../types';

export async function getProjects(
	currentPage: number,
	pageSize: number
): Promise<APIResponse<APIPaginatedProject>> {
	try {
		const config = getConfig();

		const url = `/projects?page=${currentPage}&postsperpage=${pageSize}`;

		const response = await instance.get<APIPaginatedProject>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

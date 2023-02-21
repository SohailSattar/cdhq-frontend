// This is a POST request mentioned as getUsersByDepartments because it shall return the list in return

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPaginatedUser } from '../types';

export async function getUsersByDepartments(
	currentPage: number,
	pageSize: number,
	deptIds: string[],
	keyword: string = '',
	parameter?: string
): Promise<APIResponse<APIPaginatedUser>> {
	try {
		const config = getConfig();

		let keywordParameter = '';
		if (keyword !== '') {
			keywordParameter = `&keyword=${keyword}`;
		}

		let url = `/departments/users${keywordParameter}?page=${currentPage}&postsperpage=${pageSize}`;

		const response = await instance.post<APIPaginatedUser>(url, {
			ids: deptIds,
		},config);

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

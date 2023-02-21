import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIPagedPhoneDirectory } from '../types';

export async function getPhoneDirectoryList(
	currentPage: number = 1,
	pageSize: number = 20,
    keyword:string = '',
	parameter?: string): Promise<APIResponse<APIPagedPhoneDirectory>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIPagedPhoneDirectory>(`/phone-directory?page=${currentPage}&postsperpage=${pageSize}&keyword=${keyword}`, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response;
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';

export async function deleteProject(id: string): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		const url = `/users/project/${id}`;

		await instance.delete(url, config);
		const data = true;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';

export async function checkIfEmployeeExists(
	id: number
): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		const url = `/employees/${id}/exists`;

		const response = await instance.get<boolean>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

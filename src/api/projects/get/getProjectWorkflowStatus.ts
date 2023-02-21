import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectWorkflowStatus } from '../types';

export async function getProjectWorkflowStatus(
	id: string
): Promise<APIResponse<APIProjectWorkflowStatus>> {
	try {
		const config = getConfig();

		const url = `/projects/${id}/workflow-status`;

		const response = await instance.get<APIProjectWorkflowStatus>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

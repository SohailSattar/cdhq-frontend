import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProjectInfoStatus } from "../types";

export async function getProjectInfoStatus(
	id: string
): Promise<APIResponse<APIProjectInfoStatus>> {
	try {
		const config = getConfig();

		const url = `/projects/${id}/info-status`;

		const response = await instance.get<APIProjectInfoStatus>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

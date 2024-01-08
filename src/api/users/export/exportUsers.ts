import { instance } from "../../../network";
import {
	APIExportData,
	APIResponse,
	APIResponseStatus,
	getConfig,
} from "../..";

export async function exportUsers(
	exportParams: APIExportData
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.post<APIResponseStatus>(
			"/users/export",
			exportParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { APIUpdateDepartmentStatus } from "../types";

export async function updateDepartmentStatus(
	updateStatusParams: APIUpdateDepartmentStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = "/departments/status";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateStatusParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

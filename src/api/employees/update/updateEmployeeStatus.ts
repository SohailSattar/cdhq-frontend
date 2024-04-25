import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { APIUpdateEmployeeStatus } from "../types";

export async function updateEmployeeStatus(
	updateStatusParams: APIUpdateEmployeeStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = "/employees/status";

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

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeUpdateStatus } from "../types";

export async function checkEmployeeUpdateStatus(
	Id: string
): Promise<APIResponse<APIEmployeeUpdateStatus>> {
	try {
		const config = getConfig();

		const url = `/users/${Id}/check-updates`;

		const response = await instance.get<APIEmployeeUpdateStatus>(url, config);
		const data = response.data;

		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

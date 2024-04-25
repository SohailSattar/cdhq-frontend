import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewEmployee } from "../types";

import { EMPLOYEE } from "../../../RouteConfig";

export async function addEmployee(
	employeeParams: APINewEmployee
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const response = await instance.post<APIResponseStatus>(
			EMPLOYEE,
			employeeParams,
			config
		);

		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

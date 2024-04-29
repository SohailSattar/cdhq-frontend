import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateEmployee } from "../types";

import { EMPLOYEES } from "../../ROUTES";

export const updateEmployee = async (
	updateEmployeeParams: APIUpdateEmployee
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = EMPLOYEES;

		const response = await instance.put<APIResponseStatus>(
			url,
			updateEmployeeParams,
			config
		);

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

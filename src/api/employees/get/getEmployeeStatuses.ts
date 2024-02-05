import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeStatus } from "../types";

import { EMPLOYEES } from "../../ROUTES";

export async function getEmployeeStatuses(): Promise<
	APIResponse<APIEmployeeStatus[]>
> {
	try {
		const config = getConfig();

		const url = `${EMPLOYEES}/statuses`;

		const response = await instance.get<APIEmployeeStatus[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

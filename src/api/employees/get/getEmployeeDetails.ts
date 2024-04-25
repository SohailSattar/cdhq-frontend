import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeDetail } from "../types";

export async function getEmployeeDetails(
	id: string
): Promise<APIResponse<APIEmployeeDetail>> {
	try {
		const config = getConfig();

		const url = `/employees/${id}/details`;

		const response = await instance.get<APIEmployeeDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

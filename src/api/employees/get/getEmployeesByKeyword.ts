import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeItem } from "../types";

export async function getEmployeesByKeyword(
	keyword: string
): Promise<APIResponse<APIEmployeeItem[]>> {
	try {
		const config = getConfig();

		const url = `/employees/list/all/${keyword}`;

		const response = await instance.get<APIEmployeeItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

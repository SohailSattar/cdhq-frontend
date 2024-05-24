import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIDepartmentItem } from "../types";

export async function getSectionsByDepartments(
	id: Id
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		const config = getConfig();

		const url = `/departments/${id}/sections`;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

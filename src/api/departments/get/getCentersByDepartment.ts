import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedUser } from "../../users/types";
import { APIDepartmentItem } from "../types";

export async function getCentersByDepartment(
	id: Id
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		const config = getConfig();

		const url = `/departments/${id}/centers`;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

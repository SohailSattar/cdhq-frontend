import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProjectItem } from "../types";

export async function getAllProjectsList(): Promise<
	APIResponse<APIProjectItem[]>
> {
	try {
		const config = getConfig();

		const url = "/projects/list/all";

		const response = await instance.get<APIProjectItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

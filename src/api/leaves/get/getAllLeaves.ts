import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPaginatedLeaves } from "../types";

export async function getAllLeaves(): Promise<APIResponse<APIPaginatedLeaves>> {
	try {
		const config = getConfig();

		const url = "/leaves";

		const response = await instance.get<APIPaginatedLeaves>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

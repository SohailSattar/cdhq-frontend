import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIHonor } from "../types";

export async function getLatest20Honors(): Promise<APIResponse<APIHonor[]>> {
	try {
		const response = await instance.get<APIHonor[]>("/honors/latest");
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

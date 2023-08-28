import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIType } from "../types";

export async function getLinkTypes(): Promise<APIResponse<APIType[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIType[]>("/types/links", config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIType } from "../types";

export async function getImageTypes(): Promise<APIResponse<APIType[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIType[]>("/types/images", config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

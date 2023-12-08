import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIType } from "../types";

export async function getAllMenuTypes(): Promise<APIResponse<APIType[]>> {
	try {
		const response = await instance.get<APIType[]>("/types/menu");
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

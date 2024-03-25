import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIRelative } from "../types";

export async function getRelatives(): Promise<APIResponse<APIRelative[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIRelative[]>(`/relatives`, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

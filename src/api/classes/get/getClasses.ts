import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIClass } from "../types";

export async function getClasses(): Promise<APIResponse<APIClass[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIClass[]>("/classes", config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

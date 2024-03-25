import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIBloodType } from "../types";

export async function getBloodTypes(): Promise<APIResponse<APIBloodType[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIBloodType[]>(`/blood-types`, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

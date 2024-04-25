import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIReligion } from "../types";

export async function getReligions(): Promise<APIResponse<APIReligion[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIReligion[]>(`/religions`, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIGender } from "../types";

export async function getGenders(): Promise<APIResponse<APIGender[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIGender[]>("/genders", config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

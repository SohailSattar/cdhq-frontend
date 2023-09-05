import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APICreation } from "../types";

export async function getCreationsList(): Promise<APIResponse<APICreation[]>> {
	try {
		const url = `/creations`;

		const response = await instance.get<APICreation[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

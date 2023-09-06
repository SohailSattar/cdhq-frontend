import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APICreation } from "../types";

export async function getLatest10CreationsList(
	typeId: number
): Promise<APIResponse<APICreation[]>> {
	try {
		const url = `/creations/latest/${typeId}`;

		const response = await instance.get<APICreation[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

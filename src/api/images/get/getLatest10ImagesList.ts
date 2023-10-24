import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIImage } from "../types";

export async function getLatest10ImagesList(
	typeId: number
): Promise<APIResponse<APIImage[]>> {
	try {
		const url = `/images/latest/${typeId}`;

		const response = await instance.get<APIImage[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APINews } from "../types";

export async function getLatest20News(): Promise<APIResponse<APINews[]>> {
	try {
		const url = `/news/latest`;

		const response = await instance.get<APINews[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

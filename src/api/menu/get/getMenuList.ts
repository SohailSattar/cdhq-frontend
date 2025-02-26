import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIMenuListItem } from "../types";

export async function getMenuList(): Promise<APIResponse<APIMenuListItem[]>> {
	try {
		const url = `/menu`;

		const response = await instance.get<APIMenuListItem[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

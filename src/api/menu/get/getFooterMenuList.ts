import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIMenuItem } from "../types";

export async function getFooterMenuList(): Promise<APIResponse<APIMenuItem[]>> {
	try {
		const url = `/menu/footer`;

		const response = await instance.get<APIMenuItem[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

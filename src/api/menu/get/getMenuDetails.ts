import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIMenuItemDetail } from "../types";

export async function getMenuDetails(
	id: Id
): Promise<APIResponse<APIMenuItemDetail>> {
	try {
		const url = `/menu/${id}`;

		const response = await instance.get<APIMenuItemDetail>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

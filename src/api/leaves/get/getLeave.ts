import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APILeaveItem } from "../types";

export async function getLeave(id: Id): Promise<APIResponse<APILeaveItem>> {
	try {
		const config = getConfig();

		const url = `/leaves/${id}`;

		const response = await instance.get<APILeaveItem>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

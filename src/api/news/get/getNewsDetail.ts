import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APINewsDetail } from "../types";

export async function getNewsDetail(
	id: Id
): Promise<APIResponse<APINewsDetail>> {
	try {
		const config = getConfig();

		const url = `/news/${id}`;

		const response = await instance.get<APINewsDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, APIResponseStatus, APIStatus, getConfig } from "../..";
import { instance } from "../../../network";

export async function updateNewsStatus(
	statusParams: APIStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = "/news/status";

		const response = await instance.put<APIResponseStatus>(
			url,
			statusParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

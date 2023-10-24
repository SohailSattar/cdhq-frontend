import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APIUpdateImage, APIUpdateImageDetail } from "../types";

export async function updateImageDetail(
	params: APIUpdateImageDetail
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.put<APIResponseStatus>(
			"/images/detail",
			params,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

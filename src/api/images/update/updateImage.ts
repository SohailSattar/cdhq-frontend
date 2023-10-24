import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APIUpdateImage } from "../types";

export async function updateImage(
	params: APIUpdateImage
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const response = await instance.put<APIResponseStatus>(
			"/images",
			params,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { APIUpdateProjectThumbnail } from "../types";

export async function updateProjectThumbnail(
	updateThumbnailParams: APIUpdateProjectThumbnail
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/projects/thumbnail";

		console.log(url);

		const response = await instance.put<APIResponseStatus>(
			url,
			updateThumbnailParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

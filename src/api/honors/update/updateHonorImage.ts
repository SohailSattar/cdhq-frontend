import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateHonorImage } from "../types";

export const updateHonorImage = async (
	updateNewsImageParams: APIUpdateHonorImage
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/honors/image";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateNewsImageParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

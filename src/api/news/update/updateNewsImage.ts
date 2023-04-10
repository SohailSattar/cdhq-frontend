import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateNewsImage } from "../types";

export const updateNewsImage = async (
	updateNewsImageParams: APIUpdateNewsImage
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		console.log(updateNewsImageParams);

		const url = "/news/image";

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

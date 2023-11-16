import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateNewsVideo } from "../types";

export const updateNewsVideo = async (
	updateNewsVideoParams: APIUpdateNewsVideo
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/news/video";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateNewsVideoParams,
			config
		);

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

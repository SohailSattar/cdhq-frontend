import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewNews } from "../types";

export async function addNews(
	newsParams: APINewNews
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		console.log(newsParams);

		const response = await instance.post<APIResponseStatus>(
			"/news/",
			newsParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

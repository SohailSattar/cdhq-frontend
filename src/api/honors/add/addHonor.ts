import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewHonor } from "../types";

export async function addHonor(
	honorParams: APINewHonor
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const response = await instance.post<APIResponseStatus>(
			"/honors/",
			honorParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

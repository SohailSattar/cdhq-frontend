import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APIUpdateHonor } from "../types";

export async function addHonor(
	honorParams: APIUpdateHonor
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const response = await instance.put<APIResponseStatus>(
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

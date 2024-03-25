import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { APILoginUser } from "../types";

export async function updatePassword(
	updatePasswordParams: APILoginUser
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = "/account/password";

		var response = await instance.put<APIResponseStatus>(
			url,
			updatePasswordParams,
			config
		);
		const data = response.data;

		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

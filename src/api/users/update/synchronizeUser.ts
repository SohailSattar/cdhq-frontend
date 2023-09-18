import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APISyncUser } from "../types";

export const synchronizeUser = async (
	syncParams: APISyncUser
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = `/users/synchronize`;

		const response = await instance.put<APIResponseStatus>(
			url,
			syncParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APINewMenuItem } from "../types";

export const addMenuItem = async (
	newMenuItemParams: APINewMenuItem
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/menu";

		const response = await instance.post<APIResponseStatus>(
			url,
			newMenuItemParams,
			config
		);

		const data = response.data;

		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

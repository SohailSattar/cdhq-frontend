import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateMenuItem } from "../types";

export const updateMenuItem = async (
	updateMenuItemParams: APIUpdateMenuItem
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = "/menu";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateMenuItemParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

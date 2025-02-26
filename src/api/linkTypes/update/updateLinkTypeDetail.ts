import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateLinkType } from "../types";

export const updateLinkTypeDetail = async (
	updateMenuItemParams: APIUpdateLinkType
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = "/types/links";

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

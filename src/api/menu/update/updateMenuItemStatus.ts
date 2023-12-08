import { APIResponse, APIResponseStatus, APIStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { MENU } from "../../ROUTES";

export async function updateMenuItemStatus(
	statusParams: APIStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = `${MENU}/status`;

		const response = await instance.put<APIResponseStatus>(
			url,
			statusParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

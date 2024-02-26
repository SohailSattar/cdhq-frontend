import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { APIUpdateCivilDefenseBuildingStatus } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";

export async function updateCdBuildingStatus(
	updateStatusParams: APIUpdateCivilDefenseBuildingStatus
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = `${CD_BUILDINGS}/status`;

		const response = await instance.put<APIResponseStatus>(
			url,
			updateStatusParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

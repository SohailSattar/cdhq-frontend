import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APICreateCivilDefenseBuilding } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";

export async function addCdBuilding(
	buildingParams: APICreateCivilDefenseBuilding
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const response = await instance.post<APIResponseStatus>(
			`${CD_BUILDINGS}`,
			buildingParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

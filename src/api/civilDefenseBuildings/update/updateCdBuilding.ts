import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateCivilDefenseBuilding } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";

export const updateCdBuilding = async (
	buildingParams: APIUpdateCivilDefenseBuilding
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = `${CD_BUILDINGS}`;

		const response = await instance.put<APIResponseStatus>(
			url,
			buildingParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

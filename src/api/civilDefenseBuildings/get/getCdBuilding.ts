import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICivilDefenseBuildingDetail } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";
import { Id } from "../../../utils";

export async function getCdBuilding(
	id: Id
): Promise<APIResponse<APICivilDefenseBuildingDetail>> {
	try {
		const config = getConfig();

		const url = `${CD_BUILDINGS}/${id}`;

		const response = await instance.get<APICivilDefenseBuildingDetail>(
			url,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

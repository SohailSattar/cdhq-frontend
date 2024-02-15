import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICivilDefenseBuilding } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";

export async function getCdBuildings(): Promise<
	APIResponse<APICivilDefenseBuilding[]>
> {
	try {
		const config = getConfig();

		const url = `${CD_BUILDINGS}`;

		const response = await instance.get<APICivilDefenseBuilding[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

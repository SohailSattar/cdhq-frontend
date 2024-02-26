import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICivilDefenseBuildingOwner } from "../types";

import { CD_BUILDINGS_OWNERS } from "../../ROUTES";

export async function getCdBuildingsOwners(): Promise<
	APIResponse<APICivilDefenseBuildingOwner[]>
> {
	try {
		const config = getConfig();

		const url = `${CD_BUILDINGS_OWNERS}`;

		const response = await instance.get<APICivilDefenseBuildingOwner[]>(
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

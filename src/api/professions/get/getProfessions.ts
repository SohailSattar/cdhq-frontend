import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProfession } from "../types";

import { PROFESSIONS } from "../../ROUTES";

export async function getProfessions(): Promise<APIResponse<APIProfession[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIProfession[]>(PROFESSIONS, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIWorkGroup } from "../types";

import { WORKS } from "../../ROUTES";

export async function getWorkGroups(): Promise<APIResponse<APIWorkGroup[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIWorkGroup[]>(
			`${WORKS}/groups`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

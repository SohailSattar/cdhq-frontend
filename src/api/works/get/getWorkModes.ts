import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIWorkMode } from "../types";

import { WORKS } from "../../ROUTES";

export async function getWorkModes(): Promise<APIResponse<APIWorkMode[]>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIWorkMode[]>(
			`${WORKS}/modes`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

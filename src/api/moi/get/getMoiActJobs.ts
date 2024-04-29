import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIActualJobMOI } from "../types";
import { Id } from "../../../utils";

import { MOI } from "../../ROUTES";

export async function getMoiActJobs(
	categoryId: Id
): Promise<APIResponse<APIActualJobMOI[]>> {
	try {
		const config = getConfig();

		const url = `${MOI}/job/categories/${categoryId}/list`;

		const response = await instance.get<APIActualJobMOI[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

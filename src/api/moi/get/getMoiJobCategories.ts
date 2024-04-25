import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIJobCategory } from "../types";

import { MOI } from "../../ROUTES";

export async function getMoiJobCategories(): Promise<
	APIResponse<APIJobCategory[]>
> {
	try {
		const config = getConfig();

		const url = `${MOI}/job/categories`;

		const response = await instance.get<APIJobCategory[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

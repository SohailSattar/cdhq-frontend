import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentGroup } from "../types";

import { DEPARTMENTS } from "../../ROUTES";

export async function getDepartmentGroups(): Promise<
	APIResponse<APIDepartmentGroup[]>
> {
	try {
		const config = getConfig();

		const url = `${DEPARTMENTS}/groups`;

		const response = await instance.get<APIDepartmentGroup[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentLevel } from "../types";

import { DEPARTMENTS } from "../../ROUTES";

export async function getDepartmentLevels(): Promise<
	APIResponse<APIDepartmentLevel[]>
> {
	try {
		const config = getConfig();

		const url = `${DEPARTMENTS}/levels`;

		const response = await instance.get<APIDepartmentLevel[]>(url, config);
		const data = response.data.filter((x) => x.id !== 0);
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentStatus } from "../types";

import { DEPARTMENTS } from "../../ROUTES";

export async function getDepartmentStatuses(): Promise<
	APIResponse<APIDepartmentStatus[]>
> {
	try {
		const config = getConfig();

		const url = `${DEPARTMENTS}/statuses`;

		const response = await instance.get<APIDepartmentStatus[]>(url, config);
		const data = response.data.filter((x) => x.id !== 0);
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

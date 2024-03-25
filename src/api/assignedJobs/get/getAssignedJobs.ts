import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIAssignedJob } from "../types";

import { ASSIGNED_JOBS } from "../../ROUTES";

export async function getAssignedJobs(): Promise<
	APIResponse<APIAssignedJob[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIAssignedJob[]>(
			ASSIGNED_JOBS,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

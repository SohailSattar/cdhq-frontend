import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIHealthStatus } from "../types";

export async function getHealthStatuses(): Promise<
	APIResponse<APIHealthStatus[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIHealthStatus[]>(
			`/health-statuses`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

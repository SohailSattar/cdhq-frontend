import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIMaritalStatus } from "../types";

export async function getMaritalStatuses(): Promise<
	APIResponse<APIMaritalStatus[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIMaritalStatus[]>(
			"/marital-statuses",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

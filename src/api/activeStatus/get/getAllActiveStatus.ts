import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIActiveStatus } from "../types";

export async function getAllActiveStatus(): Promise<
	APIResponse<APIActiveStatus[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIActiveStatus[]>(
			`/active-status`,
			config
		);
		const data = response.data;

		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

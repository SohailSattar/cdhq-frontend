import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APISignatureListItem } from "../types";

export async function getSignaturesList(): Promise<
	APIResponse<APISignatureListItem[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APISignatureListItem[]>(
			`/signatures-list`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

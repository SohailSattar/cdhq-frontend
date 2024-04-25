import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APISpecialNeed } from "../types";

export async function getSpecialNeeds(): Promise<
	APIResponse<APISpecialNeed[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APISpecialNeed[]>(
			`/special-needs`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIMilitaryTrained } from "../types";

export async function getMilitaryTrained(): Promise<
	APIResponse<APIMilitaryTrained[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIMilitaryTrained[]>(
			"/military-trained",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIMilitaryWear } from "../types";

export async function getMilitaryWear(): Promise<
	APIResponse<APIMilitaryWear[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIMilitaryWear[]>(
			"/military-wear",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

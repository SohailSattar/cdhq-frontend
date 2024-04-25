import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APINationalService } from "../types";

export async function getNationalServices(): Promise<
	APIResponse<APINationalService[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APINationalService[]>(
			"/national-services",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

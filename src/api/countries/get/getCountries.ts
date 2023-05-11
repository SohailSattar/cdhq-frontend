import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICountryItem } from "../types";

export async function getCountries(): Promise<APIResponse<APICountryItem[]>> {
	try {
		const config = getConfig();

		const url = "/countries";

		const response = await instance.get<APICountryItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APILoginStatus } from "../types";

export async function checkLoginStatus(): Promise<APIResponse<APILoginStatus>> {
	try {
		const config = getConfig();

		const url = `/account/login-status`;

		const response = await instance.get<APILoginStatus>(url, config);
		const data = response.data;
		console.log(data);
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

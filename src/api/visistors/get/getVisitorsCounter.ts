import { v4 as uuidv4 } from "uuid";
import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICount } from "../types";
import { VISITORS } from "../../ROUTES";

export async function getVisitorsCounter(): Promise<APIResponse<APICount>> {
	try {
		let token = localStorage.getItem("sessionToken") || uuidv4();
		localStorage.setItem("sessionToken", token);

		const response = await instance.post<APICount>(`${VISITORS}/count`, {
			sessionToken: token!,
		});

		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

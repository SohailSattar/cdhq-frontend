import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APICount } from "../types";
import { VISITORS } from "../../ROUTES";

export async function getVisitorsCounter(): Promise<APIResponse<APICount>> {
	try {
		const config = getConfig();

		const response = await instance.get<APICount>(`${VISITORS}/count`, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

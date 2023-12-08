import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIVideo } from "../types";
import { IMAGES } from "../../ROUTES";

export async function getVideosList(): Promise<APIResponse<APIVideo[]>> {
	try {
		const url = `${IMAGES}/videos`;

		const response = await instance.get<APIVideo[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

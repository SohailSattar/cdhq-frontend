import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIImageDetail } from "../types";

export async function getImageDetail(
	Id: Id
): Promise<APIResponse<APIImageDetail>> {
	try {
		const url = `/images/${Id}`;

		const response = await instance.get<APIImageDetail>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

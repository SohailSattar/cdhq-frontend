import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIHonorDetail } from "../types";

export async function getHonorDetail(
	id: Id
): Promise<APIResponse<APIHonorDetail>> {
	try {
		const url = `/honors/${id}`;

		const response = await instance.get<APIHonorDetail>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

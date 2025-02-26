import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIHonor } from "../types";

export async function getHonorDetail(id: Id): Promise<APIResponse<APIHonor>> {
	try {
		const url = `/honors/${id}`;

		const response = await instance.get<APIHonor>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

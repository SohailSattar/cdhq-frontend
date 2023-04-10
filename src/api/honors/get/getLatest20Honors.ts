import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIHonorDetail } from "../types";

export async function getLatest20Honors(): Promise<
	APIResponse<APIHonorDetail[]>
> {
	try {
		const response = await instance.get<APIHonorDetail[]>("/honors/latest");
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

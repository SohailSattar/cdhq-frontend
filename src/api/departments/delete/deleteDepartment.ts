import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";

export async function deleteDepartment(
	id: Id
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = `/departments/${id}`;

		var response = await instance.delete(url, config);
		const data = response.data;
		return { data };
		// return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

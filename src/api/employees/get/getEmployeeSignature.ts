import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployeeSignature } from "../types";

export async function getEmployeeSignature(
	id: string
): Promise<APIResponse<APIEmployeeSignature>> {
	try {
		const config = getConfig();

		const url = `/employees/${id}/signature`;

		const response = await instance.get<APIEmployeeSignature>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

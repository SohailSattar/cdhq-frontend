import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateEmployeeSignature } from "../types";

export const updateEmployeeSignature = async (
	updateSignatureParams: APIUpdateEmployeeSignature
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/employees/signature";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateSignatureParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

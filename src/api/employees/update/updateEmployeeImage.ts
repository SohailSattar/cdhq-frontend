import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateEmployeePhoto } from "../types";

export const updateEmployeeImage = async (
	updateEmployeePhotoParams: APIUpdateEmployeePhoto
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/employees/image";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateEmployeePhotoParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

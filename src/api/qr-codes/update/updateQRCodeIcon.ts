import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { QR_CODE } from "../../ROUTES";
import { APIUpdateQRCodeIcon } from "../types";

export async function updateQRCodeIcon(
	iconParams: APIUpdateQRCodeIcon
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const url = `${QR_CODE}/icon`;

		const response = await instance.put<APIResponseStatus>(
			url,
			iconParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

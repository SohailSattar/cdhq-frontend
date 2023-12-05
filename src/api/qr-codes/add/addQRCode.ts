import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewQRCode } from "../types";
import * as API from "../../ROUTES";

export async function addQRCode(
	qrCodeParams: APINewQRCode
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const response = await instance.post<APIResponseStatus>(
			API.QR_CODE,
			qrCodeParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

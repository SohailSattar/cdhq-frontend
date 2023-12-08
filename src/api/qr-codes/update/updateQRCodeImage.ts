import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { QR_CODE } from "../../ROUTES";
import { APIUpdateQRCodeImage } from "../types";

export async function updateQRCodeImage(
	imageParams: APIUpdateQRCodeImage
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const url = `${QR_CODE}/image`;

		const response = await instance.put<APIResponseStatus>(
			url,
			imageParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

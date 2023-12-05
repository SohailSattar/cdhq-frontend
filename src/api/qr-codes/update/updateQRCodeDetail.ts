import { APIResponse, APIResponseStatus, APIStatus, getConfig } from "../..";
import { instance } from "../../../network";
import { QR_CODE } from "../../ROUTES";
import { APIUpdateQRCodeDetail } from "../types";

export async function updateQRCodeDetail(
	detailParams: APIUpdateQRCodeDetail
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig();

		const url = `${QR_CODE}`;

		const response = await instance.put<APIResponseStatus>(
			url,
			detailParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

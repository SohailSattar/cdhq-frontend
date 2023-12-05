import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIQRCodeItem } from "../types";
import { QR_CODE } from "../../ROUTES";

export async function getAllQRCodes(): Promise<APIResponse<APIQRCodeItem[]>> {
	try {
		const url = `${QR_CODE}/all`;

		const response = await instance.get<APIQRCodeItem[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

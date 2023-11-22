import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIQRCodeItem } from "../types";

export async function getQRCodes(): Promise<APIResponse<APIQRCodeItem[]>> {
	try {
		const url = `/qr-codes`;

		const response = await instance.get<APIQRCodeItem[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

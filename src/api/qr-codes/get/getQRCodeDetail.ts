import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIQRCodeDetail } from "../types";
import { QR_CODE } from "../../ROUTES";

export async function getQRCodeDetail(
	id: Id
): Promise<APIResponse<APIQRCodeDetail>> {
	try {
		const url = `${QR_CODE}/${id}`;

		const response = await instance.get<APIQRCodeDetail>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

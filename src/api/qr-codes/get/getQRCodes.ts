import { APIResponse } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedQRCodeItem } from "../types";
import { QR_CODE } from "../../ROUTES";

export async function getQRCodes(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedQRCodeItem>> {
	try {
		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url =
			`${QR_CODE}?page=${currentPage}&postsperpage=${pageSize}` + queryParam!;

		const response = await instance.get<APIPaginatedQRCodeItem>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

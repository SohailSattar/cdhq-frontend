import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIParentMenuItem } from "../types";
import { MENU } from "../../ROUTES";

export async function getParentMenuItems(): Promise<
	APIResponse<APIParentMenuItem[]>
> {
	try {
		const url = `${MENU}/parents`;

		const response = await instance.get<APIParentMenuItem[]>(url);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

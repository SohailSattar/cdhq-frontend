import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APILinkTypeDetail } from "../types";

export async function getLinkType(
	Id: Id
): Promise<APIResponse<APILinkTypeDetail>> {
	try {
		const config = getConfig();

		const url = `/types/links/${Id}`;

		const response = await instance.get<APILinkTypeDetail>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

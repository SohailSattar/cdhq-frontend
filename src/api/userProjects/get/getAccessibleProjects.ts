import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProjectItem } from "../../projects/types";

export async function getAccessibleProjects(
	keyword?: string
): Promise<APIResponse<APIProjectItem[]>> {
	try {
		const config = getConfig();

		let parameters = "";

		if (keyword) {
			parameters += `?keyword=${keyword}`;
		}

		const url = `/user-projects/accessed${parameters}`;

		const response = await instance.get<APIProjectItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

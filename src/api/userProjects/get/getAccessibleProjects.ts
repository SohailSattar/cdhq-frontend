import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProjectItem } from "../../projects/types";

export async function getAccessibleProjects(): Promise<
	APIResponse<APIProjectItem[]>
> {
	try {
		const config = getConfig();

		const url = "/user-projects/accessed";

		const response = await instance.get<APIProjectItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

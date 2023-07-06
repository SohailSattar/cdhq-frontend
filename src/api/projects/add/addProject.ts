import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewProject } from "../types";

export async function addProject(
	projectParams: APINewProject
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/projects/";

		const response = await instance.post<APIResponseStatus>(
			url,
			projectParams,
			config
		);

		const data = response.data;
		return { data };
	} catch (error) {
		return { error };
	}
}

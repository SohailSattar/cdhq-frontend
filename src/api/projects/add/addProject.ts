import { instance } from "../../../network";
import { APIResponse, APIResponseStatus, getConfig } from "../..";
import { APINewProject } from "../types";

export async function addProject(
	projectParams: APINewProject
): Promise<APIResponse<APIResponseStatus>> {
	try {
		const config = getConfig("multipart/form-data");

		const url = "/projects/";
		console.log(projectParams);

		const response = await instance.post<APIResponseStatus>(
			url,
			projectParams,
			config
		);

		console.log(projectParams);

		const data = response.data;
		return { data };
	} catch (error) {
		console.log(error);
		return { error };
	}
}

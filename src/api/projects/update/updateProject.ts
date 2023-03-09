import { getConfig } from "../..";
import { instance } from "../../../network";
import { APIResponse, APIResponseStatus } from "../../types";
import { APIUpdateProject } from "../types";

export const updateProject = async (
	updateProjectParams: APIUpdateProject
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();
		console.log(updateProjectParams);
		const url = "/projects";

		const response = await instance.put<APIResponseStatus>(
			url,
			updateProjectParams,
			config
		);
		const data = response.data;
		return { data };
		// return {result};
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIUpdateUserProjectDetail } from "../types";

export async function updateUserProject(
	updateUserProjectParams: APIUpdateUserProjectDetail
): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		await instance.put<APIUpdateUserProjectDetail>(
			"/user-projects",
			updateUserProjectParams,
			config
		);
		const data = true;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

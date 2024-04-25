import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIQualification } from "../types";

export async function getQualifications(): Promise<
	APIResponse<APIQualification[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIQualification[]>(
			`/qualifications`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

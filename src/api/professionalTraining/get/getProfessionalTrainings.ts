import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIProfessionalTraining } from "../types";

export async function getProfessionalTrainings(): Promise<
	APIResponse<APIProfessionalTraining[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIProfessionalTraining[]>(
			`/professional-trainings`,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

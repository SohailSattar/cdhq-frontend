import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIContractType } from "../types";

export async function getContractTypes(): Promise<
	APIResponse<APIContractType[]>
> {
	try {
		const config = getConfig();

		const response = await instance.get<APIContractType[]>(
			"/contracts",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

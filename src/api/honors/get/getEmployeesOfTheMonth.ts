import { APIResponse } from "../..";
import { instance } from "../../../network";
import { APIHonor } from "../types";

export async function getEmployeesOfTheMonth(): Promise<
	APIResponse<APIHonor[]>
> {
	try {
		const response = await instance.get<APIHonor[]>(
			"/honors/employees-of-the-month"
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

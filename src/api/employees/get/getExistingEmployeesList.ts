import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployee } from "../types";

export async function getExistingEmployees(
	employeeNumber: string
): Promise<APIResponse<APIEmployee[]>> {
	try {
		const config = getConfig();

		const url = `/employees/list/${employeeNumber}`;

		console.log(config);

		const response = await instance.get<APIEmployee[]>(url, config);
		const data = response.data;
		console.log(data);
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		console.log(err);
		return { error };
	}
}

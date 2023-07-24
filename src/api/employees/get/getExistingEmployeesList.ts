import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIEmployee, APIExistingEmployee } from "../types";

export async function getExistingEmployees(
	employeeNumber: string
): Promise<APIResponse<APIExistingEmployee[]>> {
	try {
		const config = getConfig();

		const url = `/employees/list/${employeeNumber}`;

		const response = await instance.get<APIExistingEmployee[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

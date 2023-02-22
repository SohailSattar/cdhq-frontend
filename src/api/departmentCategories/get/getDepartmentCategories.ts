import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentCategory } from "../types";

export async function getDepartmentCategories(): Promise<
	APIResponse<APIDepartmentCategory[]>
> {
	try {
		const config = getConfig();

		const url = `/departments/categories`;

		const response = await instance.get<APIDepartmentCategory[]>(url, config);
		const data = response.data;
		return { data };
	} catch (error: any) {
		return { error };
	}
}

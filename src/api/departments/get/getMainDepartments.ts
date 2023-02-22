import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentItem } from "../types";

export async function getMainDepartments(
	code?: string
): Promise<APIResponse<APIDepartmentItem[]>> {
	try {
		let keyword = "";
		if (code) {
			keyword = `?keyword=M1`;
		}

		const config = getConfig();

		const url = `/departments/main` + keyword;

		const response = await instance.get<APIDepartmentItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

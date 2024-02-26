import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIDepartmentOperator } from "../types";

import { DEPARTMENTS } from "../../ROUTES";

export async function getDepartmentOperators(): Promise<
	APIResponse<APIDepartmentOperator[]>
> {
	try {
		const config = getConfig();

		const url = `${DEPARTMENTS}/operators`;

		const response = await instance.get<APIDepartmentOperator[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

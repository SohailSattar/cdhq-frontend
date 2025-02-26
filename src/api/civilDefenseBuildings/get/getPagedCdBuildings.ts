import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedCivilDefenseBuilding } from "../types";

import { CD_BUILDINGS } from "../../ROUTES";

export async function getPagedCdBuildings(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	statusCode?: Id,
	orderBy?: string,
	isDescending: boolean = false
): Promise<APIResponse<APIPaginatedCivilDefenseBuilding>> {
	try {
		const config = getConfig();

		let queryParam = "";

		if (keyword) {
			queryParam += `&keyword=${keyword}`;
		}

		if (statusCode) {
			queryParam += `&statusCode=${statusCode}`;
		}

		if (orderBy) {
			queryParam += `&orderBy=${orderBy}&isDescending=${isDescending}`;
		}

		const url = `${CD_BUILDINGS}/paged?page=${currentPage}&postsperpage=${pageSize}${queryParam}`;

		const response = await instance.get<APIPaginatedCivilDefenseBuilding>(
			url,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

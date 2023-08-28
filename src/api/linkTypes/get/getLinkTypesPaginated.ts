import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";
import { APIPaginatedLinkType } from "../types";

export async function getLinkTypesPaginated(
	currentPage: number,
	pageSize: number,
	keyword?: string,
	parentId?: Id,
	orderBy?: string
): Promise<APIResponse<APIPaginatedLinkType>> {
	try {
		const config = getConfig();

		const response = await instance.get<APIPaginatedLinkType>(
			"/types/links/paged",
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

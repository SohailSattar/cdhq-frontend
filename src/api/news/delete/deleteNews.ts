import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { Id } from "../../../utils";

export async function deleteNews(id: Id): Promise<APIResponse<boolean>> {
	try {
		const config = getConfig();

		const url = `/news/${id}`;

		await instance.delete(url, config);
		const data = true;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

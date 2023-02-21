import { getConfig } from '../..';
import { instance } from '../../../network';
import { APIResponse, APIResponseStatus } from '../../types';
import { APIUpdateNews } from '../types';

export const updateNews = async (
	updateNewsParams: APIUpdateNews
): Promise<APIResponse<APIResponseStatus>> => {
	try {
		const config = getConfig();

		const url = '/news';

		const response = await instance.put<APIResponseStatus>(
			url,
			updateNewsParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
};

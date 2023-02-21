import { getConfig } from '../..';
import { instance } from '../../../network';
import { APIProjectToUser } from '../types';

export async function assignNewProjectToUser(
	newProjectToUserParams: APIProjectToUser
): Promise<any> {
	try {
		const config = getConfig();

		const url = '/users/project';

		const response = await instance.post<APIProjectToUser>(
			url,
			newProjectToUserParams,
			config
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { errors: error };
	}
}

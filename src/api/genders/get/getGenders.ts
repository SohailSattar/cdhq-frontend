import { APIResponse } from '../..';
import { instance } from '../../../network';
import { APIGender } from '../type';

export async function getGenders(): Promise<APIResponse<APIGender[]>> {
	try {
		const response = await instance.get<APIGender[]>('/genders');
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

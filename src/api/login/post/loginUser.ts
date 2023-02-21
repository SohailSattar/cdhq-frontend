import axios from 'axios';
import { APILogin, APILoginResponse, APIResponse } from '../..';
import { instance } from '../../../network';
import property from '../../../network/property';

export async function loginUser(
	loginParams: APILogin
): Promise<APIResponse<APILoginResponse>> {
	try {
		const response = await axios.post<APILoginResponse>(
			`${property.BASE_URL}account/login`,
			loginParams
		);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

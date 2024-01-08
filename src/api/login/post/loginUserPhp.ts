import axios from "axios";
import { APILogin, APILoginResponse, APIResponse } from "../..";

export async function loginUserPhp(
	loginParams: APILogin
): Promise<APIResponse<APILoginResponse>> {
	try {
		const BASE_URL_PHP = process.env.REACT_APP_BASE_URL_PHP;

		const url = `${BASE_URL_PHP}cdhq/pmain/`;
		console.log(BASE_URL_PHP);
		console.log(url);

		const response = await axios.post(url, loginParams, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		});
		const data = response.data;
		console.log(response);

		const cookies = response.headers;
		console.log(cookies);

		console.log(url);
		console.log(loginParams);
		console.log(data);
		return { data };
	} catch (err: any) {
		console.log(err);
		const error = err.response.data;
		return { error };
	}
}

// import { APILogin, APILoginResponse, APIResponse } from "../..";

// export async function loginUserPhp(
// 	loginParams: APILogin
// ): Promise<APIResponse<APILoginResponse>> {
// 	try {
// 		const BASE_URL_PHP = process.env.REACT_APP_BASE_URL_PHP;

// 		const url = `${BASE_URL_PHP}cdhq/pmain/`;
// 		console.log(BASE_URL_PHP);
// 		console.log(url);

// 		const response = await fetch(url, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "multipart/form-data",
// 			},
// 			body: new URLSearchParams(
// 				Object.entries(loginParams).map(([key, value]) => [key, String(value)])
// 			),
// 		});
// 		console.log(response);
// 		const data = await response.text();
// 		console.log(data);

// 		// Access cookies from the response headers
// 		const cookies = response.headers.get("set-cookie");
// 		console.log(cookies);

// 		console.log(url);
// 		console.log(data);

// 		return {};
// 	} catch (err: any) {
// 		console.log(err);
// 		const error = await err.json();
// 		return { error };
// 	}
// }

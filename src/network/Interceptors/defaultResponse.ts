import { AxiosResponse } from "axios";

export default function defaultResponse(response: AxiosResponse) {
	//TODO: handle error id response object
	switch (response.status) {
		case 200:
			return response;
		default:
			return Promise.reject(response);
	}
}

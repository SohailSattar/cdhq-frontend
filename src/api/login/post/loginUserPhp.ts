import axios from "axios";
import { APILogin, APILoginResponse, APIResponse } from "../..";

export async function loginUserPhp(
	loginParams: APILogin
): Promise<APIResponse<APILoginResponse>> {
	try {
		const BASE_URL_PHP = process.env.REACT_APP_BASE_URL_PHP;

		const url = `${BASE_URL_PHP}cdhq/pmain/login.php`;
		var form = document.createElement("form");
		form.target = "_blank";
		form.method = "POST";
		form.action = url;

		const { userName, password } = loginParams;

		var params: any = {
			username: userName,
			password: password,
		};

		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				var input = document.createElement("input");
				input.type = "hidden";
				input.name = i;
				input.value = params[i];
				form.appendChild(input);
			}
		}

		document.body.appendChild(form);
		form.submit();
		return {};
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}

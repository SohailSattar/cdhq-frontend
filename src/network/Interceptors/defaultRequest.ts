import { AxiosRequestConfig } from "axios";
import localStorageService from "../localStorageService";

export default function defaultRequest(config: AxiosRequestConfig) {
	const token = localStorageService?.getJwtToken();
	if (config.headers === undefined) {
		config.headers = {};
	}
	config.headers["x-bet-session"] = token ? token : "";
	return config;
}

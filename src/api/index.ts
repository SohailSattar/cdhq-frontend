import localStorageService from "../network/localStorageService";
import { ContentType, ResponseType } from "./types";

export * from "./types";

export const getConfig = (
	contentType: ContentType = "application/json",
	responseType: ResponseType = "json"
) => {
	return {
		headers: {
			Authorization: "Bearer " + localStorageService.getJwtToken(),
			"Content-Type": contentType,
		},
		responseType: responseType,
	};
};

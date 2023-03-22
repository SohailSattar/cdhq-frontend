import localStorageService from "../network/localStorageService";
import { ContentType } from "./types";

export * from "./types";

export const getConfig = (contentType: ContentType = "application/json") => {
	return {
		headers: {
			Authorization: "Bearer " + localStorageService.getJwtToken(),
			"Content-Type": contentType,
		},
	};
};

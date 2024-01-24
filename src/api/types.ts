import { Id } from "../utils";

//Base
export interface APIBase {
	id: number;
	name: string;
	nameEnglish: string;
}

// User Login
export interface APILogin {
	userName: string;
	password: string;
}

// Login Response
export interface APILoginResponse {
	id: number;
	userName: string;
	name: string;
	nameEnglish: string;
	token: string;
	role: string;
}

// Response
// export interface APIResponse<T> {}
// APICommandResponse
export interface APIResponse<T> {
	data?: T;
	error?: any;
}

export interface APIResponseStatus {
	id?: number;
	success?: boolean;
	message?: string;
	errors?: string[];
}

export interface APIResponseData {
	file: BlobPart;
}

//Pagination
export interface APIPaginate {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

export interface APIStatus {
	id: Id;
	activeStatusId: number;
}

export type ContentType = "multipart/form-data" | "application/json";
export type ResponseType = "json" | "blob";

// Generic interface
// export interface APIExportData<T> {
// 	[key: string]: T;
// }

export interface APIExportData {
	language?: string;
	isPaged: boolean;
	format: "xlsx" | "pdf";
	selectedFields: { [key: string]: string };
	queryParams?: APIQueryParams;
}

// Generic mapping for property names and their display names
export type PropertyDisplayNames<T> = Record<keyof T, Record<string, string>>;

export interface APIQueryParams {
	page?: number;
	postsPerPage?: number;
	keyword?: string;
	projectId?: Id;
	statusCode?: Id;
	orderBy?: string;
	isDescending?: boolean;
}

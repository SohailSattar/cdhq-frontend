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

//Pagination
export interface APIPaginate {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

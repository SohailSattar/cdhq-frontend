import { APIDepartmentItem } from "../departments/types";
import { APIRank } from "../ranks/types";
import { APIPaginate } from "../types";

interface APIPhone {
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
}

export interface APIPhoneDirectory extends APIPhone {
	id: number;
	fullName: string;
	nameEnglish: string;
	rank?: APIRank;
	department?: APIDepartmentItem;
}

export interface APIPagedPhoneDirectory extends APIPaginate {
	employees: APIPhoneDirectory[];
}

export interface APIPhoneDetail extends APIPhone {
	id: number;
}

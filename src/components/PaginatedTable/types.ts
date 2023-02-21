import { APIProjectGroup } from "../../api/projects/types";
import { APIRank } from "../../api/ranks/types";

export interface PhoneDirectoryColumns {
	id: number;
	rank:APIRank;
	// department: APIDe;
	fullName: string;
	nameEnglish: string;
	phone?:string;
	phone2?:string;
	phoneOffice?:string;
}

export interface UserColumns {
	id: number;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
}

export interface NewsColumns{
	id:number;
	title:string
}

export interface ProjectColumns {
	id: number;
	name: string;
	nameEnglish: string;
	nameArabic: string;
	group: APIProjectGroup;
}
import { APIActiveStatus } from "../../api/activeStatus/types";
import { APIProjectGroup } from "../../api/projects/types";
import { APIRank } from "../../api/ranks/types";

export interface PhoneDirectoryColumns {
	id: number;
	rank: APIRank;
	// department: APIDe;
	fullName: string;
	nameEnglish: string;
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
}

export interface UserColumns {
	id: number;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
	activeStatus: APIActiveStatus;
}

export interface HonorColumn {
	id: number;
	imageName: string;
	mmm: string;
	yyy: string;
	name: string;
	rank: string;
	locationFullName: string;
	type: string;
}

export interface NewsColumns {
	id: number;
	title: string;
}

export interface ProjectColumns {
	id: number;
	name: string;
	nameEnglish: string;
	nameArabic: string;
	group: APIProjectGroup;
	activeStatus: string;
}

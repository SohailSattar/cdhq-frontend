import { APIActiveStatus } from "../../api/activeStatus/types";
import { APIDepartmentItem } from "../../api/departments/types";
import { APIType as APIImageType } from "../../api/imageType/types";
import { APIType } from "../../api/linkTypes/types";
import { APIMenuItem } from "../../api/menu/types";
import { APIProjectGroup } from "../../api/projects/types";
import { APIRank } from "../../api/ranks/types";

export interface PhoneDirectoryColumns {
	id: number;
	employeeNo: number;
	rank: APIRank;
	// department: APIDe;
	name: string;
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
	nameEnglish: string;
	rank: string;
	rankEnglish: string;
	department: APIDepartmentItem;
	locationFullName: string;
	type: string;
}

export interface ImageColumn {
	id: number;
	name: string;
	imageName: string;
	nameEnglish: string;
	imageType: APIImageType;
	stars: number;
	activeStatus: APIActiveStatus;
}

export interface NewsColumns {
	id: number;
	title: string;
	activeStatus: APIActiveStatus;
}

export interface ProjectColumns {
	id: number;
	name: string;
	nameEnglish: string;
	nameArabic: string;
	group: APIProjectGroup;
	activeStatus: string;
}

export interface LinkTypeColumns {
	id: number;
	name: string;
	nameEnglish: string;
	isFile: boolean;
}

export interface MenuItemColumns {
	id: number;
	name: string;
	nameEnglish: string;
	parent: APIMenuItem;
	linkPath: string;
	isVisible: boolean;
	orderNo: number;
	linkType?: APIType;
	isExternalPath: boolean;
}

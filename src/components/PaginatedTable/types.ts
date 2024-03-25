import { APIActiveStatus } from "../../api/activeStatus/types";
import { APIAssignedJob } from "../../api/assignedJobs/types";
import { APICivilDefenseBuildingOwner } from "../../api/civilDefenseBuildingsOwners/types";
import { APIClass } from "../../api/classes/types";
import { APICountryItem } from "../../api/countries/types";
import { APIDepartmentLevel } from "../../api/departmentLevel/types";
import {
	APIDepartmentItem,
	APIDepartmentName,
} from "../../api/departments/types";
import { APIEmirate } from "../../api/emirates/types";
import { APIEmployeeStatus } from "../../api/employees/types";
import { APIGender } from "../../api/genders/types";
import { APIType as APIImageType } from "../../api/imageType/types";
import { APIType } from "../../api/linkTypes/types";
import { APIMenuItem } from "../../api/menu/types";
import { APIProjectGroup } from "../../api/projects/types";
import { APIRank } from "../../api/ranks/types";

export interface EmployeeColumns {
	id: number;
	employeeNo: string;
	rank: APIRank;
	name: string;
	age: number;
	status: APIEmployeeStatus;
	department: APIDepartmentItem;
	section: APIDepartmentItem;
	class: APIClass;
	militaryCardExpiryDate: string;
	nationality: APICountryItem;
	gender: APIGender;
	assignedJob: APIAssignedJob;
}

export interface DepartmentColumns {
	id: number;
	name: string;
	nameEnglish: string;
	fullName: string;
	fullNameEnglish: string;
	level: APIDepartmentLevel;
	parent: APIDepartmentName;
	emirate: APIEmirate;
	status: string;
}

export interface CivilDefenseBuildingColumns {
	id: number;
	name: string;
	nameEnglish: string;
	owner: APICivilDefenseBuildingOwner;
	section: APIDepartmentName;
}

export interface PhoneDirectoryColumns {
	id: number;
	employeeNo: number;
	rank: APIRank;
	department: APIDepartmentItem;
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
	createdOn: string;
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
	imageName: string;
	title: string;
	department: string;
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

export interface APIProjectUserTable {
	id: number;
	userName: string;
	department: string;
	privilege: string;
	userId: number;
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
	menuType?: APIType;
	isExternalPath: boolean;
	activeStatus: string;
}

export interface QRCodeItemColumns {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	iconName: string;
	activeStatus: APIActiveStatus;
}

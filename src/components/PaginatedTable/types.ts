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

export type EmployeeColumns = {
	id: number;
	employeeNo: string;
	rank: APIRank;
	name: string;
	nameEnglish: string;
	status: APIEmployeeStatus;
	department: APIDepartmentItem;
	section: APIDepartmentItem;
	class: APIClass;
	militaryCardExpiryDate: string;
	nationality: APICountryItem;
	gender: APIGender;
	assignedJob: APIAssignedJob;
};

// Employee History
export type EmployeeHistoryColumns = {
	name: string;
	updatedBy: string;
	fieldName: string;
	oldValue: string;
	newValue: string;
	auditDate: string;
};

export type DepartmentColumns = {
	id: number;
	name: string;
	nameEnglish: string;
	fullName: string;
	fullNameEnglish: string;
	level: APIDepartmentLevel;
	parent: APIDepartmentName;
	emirate: APIEmirate;
	status: string;
};

export type CivilDefenseBuildingColumns = {
	id: number;
	name: string;
	nameEnglish: string;
	owner: APICivilDefenseBuildingOwner;
	section: APIDepartmentName;
};

export type PhoneDirectoryColumns = {
	id: number;
	employeeNo: number;
	rank: APIRank;
	department: APIDepartmentItem;
	name: string;
	nameEnglish: string;
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
};

export type UserColumns = {
	id: number;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
	rank: APIRank;
	department: APIDepartmentName;
	activeStatus: APIActiveStatus;
};

export type HonorColumn = {
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
	activeStatus: APIActiveStatus;
};

export type ImageColumn = {
	id: number;
	name: string;
	imageName: string;
	nameEnglish: string;
	imageType: APIImageType;
	stars: number;
	activeStatus: APIActiveStatus;
};

export type NewsColumns = {
	id: number;
	imageName: string;
	title: string;
	department: APIDepartmentName;
	activeStatus: APIActiveStatus;
	action: any;
};

export type ProjectColumns = {
	id: number;
	name: string;
	nameEnglish: string;
	nameArabic: string;
	group: APIProjectGroup;
	activeStatus: APIActiveStatus;
};

export type APIProjectUserTable = {
	id: number;
	userName: string;
	department: string;
	privilege: string;
	userId: number;
};

export interface LinkTypeColumns {
	id: number;
	name: string;
	nameEnglish: string;
	isFile: boolean;
}

export type MenuItemColumns = {
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
	activeStatus: APIActiveStatus;
};

export type QRCodeItemColumns = {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	iconName: string;
	activeStatus: APIActiveStatus;
};

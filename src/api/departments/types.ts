import { APIDepartmentLevel } from "../departmentLevel/types";
import { APIEmirate } from "../emirates/types";

export interface APIDepartmentItem {
	id: number;
	name: string;
	nameEnglish: string;
	longFullName: string;
}

export interface APIDepartmentDetail extends APIDepartmentItem {
	fullName: string;
	fullNameEnglish: string;
	parent: APICategorizedDepartment;
	longShortName: string;
	longFullName: string;
	level: APIDepartmentLevel;
	emirate: APIEmirate;
}

export interface APIDepartmentHierarchy {
	value: string;
	label: string;
	nameEnglish: string;
	children?: APIDepartmentHierarchy[];
}

export interface APICategorizedDepartment {
	id: number;
	longFullName: string;
}

interface IDepartment {
	id: number;
	name: string;
	nameEnglish: string;
	levelId: number;
	emirateId: number;
	parentId?: number;
}

export interface APICreateDepartment extends IDepartment {}

export interface APIUpdateDepartment extends IDepartment {}

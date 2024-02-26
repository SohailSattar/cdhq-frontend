import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APICivilDefenseBuilding } from "../civilDefenseBuildings/types";
import { APIDepartmentGroup } from "../departmentGroups/types";
import { APIDepartmentLevel } from "../departmentLevel/types";
import { APIDepartmentOperator } from "../departmentOperators/types";
import { APIDepartmentStatus } from "../departmentStatuses/types";
import { APIEmirate } from "../emirates/types";
import { APIPaginate } from "../types";

export interface APIDepartmentItem {
	id: Id;
	name: string;
	nameEnglish: string;
	fullName: string;
	fullNameEnglish: string;
	parent: APIDepartmentName;
	level: APIDepartmentLevel;
}

export interface APIPaginatedDepartment extends APIPaginate {
	departments: APIDepartmentItem[];
}

export interface APIDepartmentName {
	id: Id;
	name: string;
	nameEnglish: string;
}

export interface APIDepartmentDetail extends APIDepartmentItem {
	id: Id;
	name: string;
	nameEnglish: string;
	fullName: string;
	fullNameEnglish: string;
	emirate: APIEmirate;
	region: APIEmirate;
	parent: APIDepartmentName;
	status: APIDepartmentStatus;
	operator: APIDepartmentOperator;
	group: APIDepartmentGroup;
	cdBuilding: APICivilDefenseBuilding;
	activeStatus: APIActiveStatus;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
}

export interface APIDepartmentHierarchy {
	id: Id;
	label: string;
	value: string;
	name: string;
	nameEnglish: string;
	children?: APIDepartmentHierarchy[];
}

export interface APICategorizedDepartment {
	id: Id;
	fullName: string;
	fullNameEnglish: string;
}

interface IDepartment {
	id: Id;
	name: string;
	nameEnglish: string;
	levelId: Id;
	emirateId?: Id;
	regionId: Id;
	parentId: Id;
	statusId: Id;
	operatorId: Id;
	groupId?: Id;
	cdBuildingId?: Id;
}

export interface APICreateDepartment {
	name: string;
	nameEnglish: string;
	levelId: Id;
	emirateId?: Id;
	regionId: Id;
	parentId: Id;
	statusId: Id;
	operatorId: Id;
	groupId?: Id;
	cdBuildingId?: Id;
}

export interface APIUpdateDepartment extends IDepartment {}
export interface APIUpdateDepartmentStatus {
	id: Id;
	activeStatusId: Id;
}

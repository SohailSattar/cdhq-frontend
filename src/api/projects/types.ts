import { APIActiveStatus } from "../activeStatus/types";
import { APIDepartmentItem } from "../departments/types";
import { APIPrivilegeItem } from "../privileges/type";
import { APIPaginate } from "../types";
import { APIUser } from "../users/types";

export interface APIProjectItem {
	id: number;
	name: string;
	nameEnglish: string;
	hasWorkflow?: boolean;
	isAvailable?: boolean;
	iconName?: string;
	pathLink?: string;
	departmentSelectionType?: string;
}

export interface APIProject extends APIProjectItem {
	nameArabic: string;
	group?: APIProjectGroup;
}

export interface APIProjectGroup {
	id: number;
	sequenceNumber: number;
	nameArabic: string;
	nameEnglish: string;
}

export interface APIProjectWithParentIdItem {
	id: number;
	name: string;
	nameEnglish: string;
	parentId?: number;
}

export interface APIProjectDetail {
	id: number;
	name: string;
	nameEnglish: string;
	hasWorkflow?: boolean;
	parent: APIProjectItem;
	group: APIProjectGroup;
	activeStatus: APIActiveStatus;
}

export interface APIProjectHierarchy {
	id: number;
	name: string;
	nameEnglish: string;
	projects?: APIProjectHierarchy[];
}

export interface APIPaginatedProject extends APIPaginate {
	projects: APIProject[];
}

export interface APIProjectUser {
	id: number;
	user: APIUser;
	privilege: APIPrivilegeItem;
	department: APIDepartmentItem;
}

export interface APIPaginatedProjectUser extends APIPaginate {
	users: APIProjectUser[];
}

export interface APIProjectWorkflowStatus {
	hasWorkflow: boolean;
}

export interface APINewProject {
	name: string;
	nameEnglish: string;
	parentId: number;
	projectGroupId: number;
	hasWorkflow: boolean;
}

export interface APIUpdateProject {
	id: string;
	name: string;
	nameEnglish: string;
	parentId: number;
	projectGroupId: number;
	hasWorkflow: boolean;
}

export interface APIUpdateProjectStatus {
	id: string;
	activeStatusId: number;
}

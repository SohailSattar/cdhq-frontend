import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APIDepartmentCategory } from "../departmentCategories/types";
import { APIDepartmentItem } from "../departments/types";
import { APIPrivilegeItem } from "../privileges/type";
import { APIPaginate } from "../types";
import { APIUser } from "../users/types";

export interface APIProjectItem {
	id: number;
	name: string;
	nameEnglish: string;
	hasWorkflow?: boolean;
	isAvailable: boolean;
	iconName?: string;
	pathLink?: string;
	isExternalPath?: boolean;
	departmentCategory?: APIDepartmentCategory;
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
	departmentCategory: APIDepartmentCategory;
	withAcademy?: boolean;
	iconName: string;
	pathLink: string;
	isExternalPath?: boolean;
	activeStatus: APIActiveStatus;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
	isActive?: boolean;
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

export interface APIProjectInfoStatus {
	hasWorkflow: boolean;
	departmentCategory?: APIDepartmentCategory;
}

export interface APINewProject {
	name: string;
	nameEnglish: string;
	parentId: Id;
	projectGroupId: number;
	departmentCategoryId?: number;
	withAcademy: boolean;
	hasWorkflow: boolean;
	pathLink?: string;
	isExternalPath: boolean;
	thumbnail: File;
	isActive: boolean;
}

export interface APIUpdateProject {
	id: string;
	name: string;
	nameEnglish: string;
	parentId?: Id;
	projectGroupId: Id;
	departmentCategoryId?: Id;
	withAcademy: boolean;
	hasWorkflow: boolean;
	pathLink?: string;
	isExternalPath: boolean;
	isActive: boolean;
}

export interface APIUpdateProjectStatus {
	id: string;
	activeStatusId: number;
}

export interface APIUpdateProjectThumbnail {
	id: string;
	thumbnail: File;
}

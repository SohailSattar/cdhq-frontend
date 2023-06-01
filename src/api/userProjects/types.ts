import { APIPaginate } from "..";
import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import {
	APICategorizedDepartment,
	APIDepartmentItem,
} from "../departments/types";
import { APIPrivilegeItem, APIPrivileges } from "../privileges/type";
import {
	APIProjectDetail,
	APIProjectWithParentIdItem,
} from "../projects/types";
import { APIUserItem } from "../users/types";

export interface APIProjectPrivilege {
	userProjectId: string;
	privilegeId: string;
}

export interface APIProjectStatus {
	id: string;
	statusId?: number;
}

export interface APIProjectToUser {
	userId: string;
	projectId: string;
	privilegeId: string;
	departmentId: Id;
	WorkflowStartFromId: string;
	WorkflowEndToId: string;
	departmentStructureType: string;
	canGrant?: boolean;
}

export interface APIUserProject extends APIPrivileges {
	id: number;
	project: APIProjectWithParentIdItem;
	canGrant: boolean;
	departmentChild: number;
	department: APIDepartmentItem;
	privilege: APIPrivilegeItem;
	activeStatus: APIActiveStatus;
}

export interface APIUserProjectPrivilege extends APIPrivileges {
	id: number;
	userId: number;
	projectId: number;
}

export interface APIPaginatedUserProject extends APIPaginate {
	projects: APIUserProject[];
}

export interface APIUserProjectItem {
	id: number;
	project: APIProjectDetail;
}

export interface APIUserProjectDetail {
	id: number;
	user: APIUserItem;
	project: APIProjectDetail;
	privilege: APIPrivilegeItem;
	department: APICategorizedDepartment | APIDepartmentItem;
	workflowStartFrom: APIActiveStatus;
	workflowEndTo: APIActiveStatus;
	departmentStructureType: string;
	canGrant: boolean;
	createdBy?: string;
	createdOn: string;
}

export interface APIUserProjectDetail2 {
	privilege: APIPrivilegeItem;
	workflowStartFrom: APIActiveStatus;
	workflowEndTo: APIActiveStatus;
}

export interface APIUpdateUserProjectDetail {
	id: string;
	privilegeId: Id;
	departmentId: Id;
	workflowStartFromId: Id;
	workflowEndToId: Id;
	departmentStructureType: Id;
	canGrant: boolean;
}

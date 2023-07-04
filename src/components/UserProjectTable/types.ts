import { APIActiveStatus } from "../../api/activeStatus/types";
import { Id } from "../../utils";

export interface APIProjectTable {
	id: number;
	projectId?: Id;
	projectName: string;
	isChildProject: boolean;
	privilege: string;
	department: string;
	insertPrivilege: boolean;
	deletePrivilege: boolean;
	updatePrivilege: boolean;
	readPrivilege: boolean;
	activeStatus: string;
	details: ProjectDetailTable; // ProjectDetailTable[];
}

export interface ProjectDetailTable {
	canGrant: boolean;
	departmentChild: number;
	status: APIActiveStatus;
}

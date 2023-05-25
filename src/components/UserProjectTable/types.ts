import { APIActiveStatus } from "../../api/activeStatus/types";

export interface APIProjectTable {
	id: number;
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

import { APIActiveStatus } from "../../api/activeStatus/types";
import { Id } from "../../utils";

export type APIProjectTable = {
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
	activeStatus: APIActiveStatus;
	details: ProjectDetailTable; // ProjectDetailTable[];
};

export interface ProjectDetailTable {
	canGrant: boolean;
	departmentStructureType: number;
	status: APIActiveStatus;
}

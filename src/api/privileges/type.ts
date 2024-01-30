import { Id } from "../../utils";

export interface APIPrivileges {
	privilegeId?: Id;
	insertPrivilege: boolean;
	deletePrivilege: boolean;
	updatePrivilege: boolean;
	readPrivilege: boolean;
	canExportExcel?: boolean;
	canExportPdf?: boolean;
}

export interface APIPrivilege extends APIPrivileges {
	sequenceNumber: number;
	name: string;
	nameEnglish: string;
}

export interface APIPrivilegeItem {
	sequenceNumber: number;
	name: string;
	nameEnglish: string;
}

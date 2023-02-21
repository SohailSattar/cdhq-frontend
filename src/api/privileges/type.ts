export interface APIPrivileges {
	insertPrivilege: boolean;
	deletePrivilege: boolean;
	updatePrivilege: boolean;
	readPrivilege: boolean;
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
